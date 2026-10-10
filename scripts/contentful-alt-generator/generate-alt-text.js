// node /Users/ling/Documents/GitHub/Portfolio-Contenful/scripts/contentful-alt-generator/generate-alt-text.js
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

const { createClient } = require('contentful-management');

const client = createClient(
  { accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN },
  { type: 'legacy' }
);

const LOCALE = 'en-US';
const MAX_RETRIES = 10;
const DEFAULT_WAIT_MS = 35000;
const MIN_GAP_MS = 13000;

// Skip assets that already have BOTH a title and a description in this locale.
const SKIP_IF_COMPLETE = true;

// Force overwrite everything, ignoring existing title/description.
// Set to true only when you deliberately want to regenerate all assets.
const FORCE_REGENERATE = false;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generateAltText() {
  try {
    const space = await client.getSpace(process.env.GATSBY_CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');

    const assets = await environment.getAssets({ mimetype_group: 'image' });

    let lastRequestAt = 0;
    let processed = 0;
    let skipped = 0;
    let failed = 0;

    for (const asset of assets.items) {
      const existingTitle =
        asset.fields.title?.[LOCALE] || asset.fields.title?.['en-GB'];
      const existingDescription =
        asset.fields.description?.[LOCALE] ||
        asset.fields.description?.['en-GB'];

      // Skip logic: only skip when both fields exist AND we're not forcing.
      const alreadyComplete =
        existingTitle && existingDescription && existingTitle.trim() !== '' && existingDescription.trim() !== '';

      if (SKIP_IF_COMPLETE && !FORCE_REGENERATE && alreadyComplete) {
        console.log(
          `⏭️  Skipping ${asset.sys.id}: title and description already present.`
        );
        skipped++;
        continue;
      }

      const fileObj =
        asset.fields.file?.[LOCALE] || asset.fields.file?.['en-GB'];

      if (!fileObj || !fileObj.url) {
        console.log(`Skipping ${asset.sys.id}: no file URL.`);
        continue;
      }

      const fileUrl = fileObj.url.startsWith('//')
        ? 'https:' + fileObj.url
        : fileObj.url;

      const mimeType = fileObj.contentType || 'image/jpeg';

      const label = existingTitle || asset.sys.id;
      console.log(`Processing: ${label} (${fileUrl})`);

      const { title: newTitle, description: altText } =
        await generateWithRetry(fileUrl, mimeType, label);

      if (!newTitle || !altText) {
        console.error(`❌ Giving up on ${asset.sys.id} after retries.`);
        failed++;
        continue;
      }

      try {
        asset.fields.title = asset.fields.title || {};
        asset.fields.description = asset.fields.description || {};

        asset.fields.title[LOCALE] = newTitle;
        asset.fields.description[LOCALE] = altText;

        const updatedAsset = await asset.update();
        await updatedAsset.publish();

        console.log(`✅ ${asset.sys.id}`);
        console.log(`   title:       "${newTitle}"`);
        console.log(`   description: "${altText}"`);
        processed++;
      } catch (err) {
        console.error(`Contentful update failed for ${asset.sys.id}:`, err.message);
        failed++;
      }

      const sinceLast = Date.now() - lastRequestAt;
      if (sinceLast < MIN_GAP_MS) {
        await sleep(MIN_GAP_MS - sinceLast);
      }
      lastRequestAt = Date.now();
    }

    console.log('');
    console.log('──────────────────────────────────────────────');
    console.log(`Processed: ${processed}`);
    console.log(`Skipped:   ${skipped}`);
    console.log(`Failed:    ${failed}`);
    console.log(`Total:     ${assets.items.length}`);
    console.log('──────────────────────────────────────────────');
  } catch (error) {
    console.error('Contentful error:', error.message);
  }
}

async function generateWithRetry(fileUrl, mimeType, label) {
  const imageB64 = await fetchBase64(fileUrl);

  const aiPrompt = [
    'You are generating metadata for an image used on a professional UX/UI portfolio website.',
    '',
    'Return STRICT JSON only, with this exact shape:',
    '{ "title": "...", "description": "..." }',
    '',
    'Rules:',
    '- "title": 3–7 words, title case, descriptive and specific. No trailing punctuation.',
    '- "description": 1–2 sentences, UK English, describing the key visual elements for screen-reader users and SEO. Focus on what the image shows in a design context (e.g. a dashboard, a wireframe, a prototype screen, a hero banner, a component library).',
    '- Do not begin the description with "This image shows" or "An image of".',
    '- Do not mention colours unless they are essential to meaning.',
    '- Do not include the word "image" in the title.',
    '- UK English spelling throughout (e.g. optimise, colour, organisation).',
    '- No markdown, no code fences, no commentary.',
  ].join('\n');

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/interactions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.GEMINI_API_KEY,
          },
          body: JSON.stringify({
            model: 'gemini-3.8-flash',
            input: [
              { type: 'text', text: aiPrompt },
              { type: 'image', data: imageB64, mime_type: mimeType },
            ],
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const text = extractText(data);
        if (text) {
          const parsed = parseJsonResponse(text);
          if (parsed && parsed.title && parsed.description) {
            return {
              title: parsed.title.trim(),
              description: parsed.description.trim(),
            };
          }
          console.warn(
            `Attempt ${attempt}: malformed JSON for "${label}", retrying...`
          );
        } else {
          console.warn(
            `Attempt ${attempt}: empty response for "${label}", retrying...`
          );
        }
      } else if (
        data?.error?.code === 'too_many_requests' ||
        response.status === 429
      ) {
        const waitMs = parseRetryMs(data?.error?.message) ?? DEFAULT_WAIT_MS;
        console.warn(
          `⏳ Rate limited on attempt ${attempt} for "${label}". Waiting ${Math.round(
            waitMs / 1000
          )}s...`
        );
        await sleep(waitMs);
        continue;
      } else {
        console.error(
          `Gemini error (attempt ${attempt}) for "${label}":`,
          JSON.stringify(data)
        );
      }
    } catch (err) {
      console.error(
        `Network error (attempt ${attempt}) for "${label}":`,
        err.message
      );
    }

    await sleep(5000);
  }

  return { title: null, description: null };
}

function parseJsonResponse(text) {
  // Strip any accidental markdown fences
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Fallback: try to extract the first {...} block
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function parseRetryMs(message) {
  if (!message) return null;
  const m = message.match(/retry in (\d+)\s*s/i);
  if (!m) return null;
  return (parseInt(m[1], 10) + 2) * 1000;
}

function extractText(data) {
  if (!data.steps) return null;
  for (const step of data.steps) {
    if (step.type === 'model_output' && Array.isArray(step.content)) {
      for (const block of step.content) {
        if (block.type === 'text' && block.text) {
          return block.text.trim();
        }
      }
    }
  }
  return null;
}

async function fetchBase64(url) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

generateAltText();