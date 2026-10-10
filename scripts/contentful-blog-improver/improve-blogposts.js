// node /Users/ling/Documents/GitHub/Portfolio-Contenful/scripts/contentful-blog-improver/improve-blogposts.js
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

const { createClient } = require('contentful-management');

const client = createClient(
  { accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN },
  { type: 'legacy' }
);

/* ------------------------------------------------------------------ */
/*  CONFIG                                                             */
/* ------------------------------------------------------------------ */

const LOCALE = 'en-US';
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master';
const CONTENT_TYPE = 'blogPost';

// Set to true to skip posts that already have an "improved" marker in tags.
// Set to false to reprocess everything.
const SKIP_IF_IMPROVED = true;

// The tag the script writes back to mark a post as processed.
const IMPROVED_TAG = 'ai-improved';

// Rate-limit safety for Gemini.
const MAX_RETRIES = 10;
const DEFAULT_WAIT_MS = 35000;
const MIN_GAP_BETWEEN_CALLS_MS = 13000;

// Model
const GEMINI_MODEL = 'gemini-3.8-flash';

/* ------------------------------------------------------------------ */
/*  MAIN                                                               */
/* ------------------------------------------------------------------ */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  try {
    const space = await client.getSpace(process.env.GATSBY_CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);

    console.log(`Fetching all entries of type "${CONTENT_TYPE}"...`);
    const entries = await environment.getEntries({
      content_type: CONTENT_TYPE,
      limit: 1000,
    });

    console.log(`Found ${entries.items.length} blog posts.\n`);

    let processed = 0;
    let skipped = 0;
    let failed = 0;

    let lastCallAt = 0;

    for (const entry of entries.items) {
      const id = entry.sys.id;
      const existingTitle = entry.fields.title?.[LOCALE] || '(untitled)';
      const existingTags = entry.fields.tags?.[LOCALE] || [];

      if (SKIP_IF_IMPROVED && existingTags.includes(IMPROVED_TAG)) {
        console.log(`⏭️  Skipping ${id} — already improved.`);
        skipped++;
        continue;
      }

      console.log('──────────────────────────────────────────────');
      console.log(`📝 Processing: ${existingTitle}`);
      console.log(`   id: ${id}`);

      try {
        /* ---------- 1. Extract existing copy ---------- */
        const existing = extractEntryCopy(entry);

        /* ---------- 2. Collect image references ---------- */
        const imageRefs = extractImageRefs(entry);
        console.log(`   Found ${imageRefs.length} image reference(s).`);

        /* ---------- 3. Analyse each image with Gemini ---------- */
        const imageAnalyses = [];
        for (const ref of imageRefs) {
          const sinceLast = Date.now() - lastCallAt;
          if (sinceLast < MIN_GAP_BETWEEN_CALLS_MS) {
            await sleep(MIN_GAP_BETWEEN_CALLS_MS - sinceLast);
          }
          lastCallAt = Date.now();

          const analysis = await analyseImage(ref.url, ref.mimeType, ref.alt);
          if (analysis) {
            imageAnalyses.push({ ref, analysis });
            console.log(`   ✔ Analysed ${ref.alt || ref.id}`);
          } else {
            console.warn(`   ⚠ Failed to analyse ${ref.alt || ref.id}`);
          }
        }

        /* ---------- 4. Generate improved copy ---------- */
        const improved = await improveBlogPost({
          existing,
          imageAnalyses,
        });

        if (!improved) {
          console.error(`❌ Failed to generate improved copy for ${id}`);
          failed++;
          continue;
        }

        /* ---------- 5. Write back to Contentful ---------- */
        entry.fields.title = entry.fields.title || {};
        entry.fields.summary = entry.fields.summary || {};
        entry.fields.content = entry.fields.content || {};
        entry.fields.tags = entry.fields.tags || {};

        entry.fields.title[LOCALE] = improved.title;
        entry.fields.summary[LOCALE] = improved.summary;
        entry.fields.content[LOCALE] = improved.content;

        // Preserve existing tags and add the marker
        const newTags = Array.from(new Set([...existingTags, IMPROVED_TAG]));
        entry.fields.tags[LOCALE] = newTags;

        const updated = await entry.update();
        await updated.publish();

        console.log(`✅ Updated ${id}`);
        console.log(`   title: ${improved.title}`);
        processed++;

        // Brief pause to avoid Contentful rate limits
        await sleep(1500);
      } catch (err) {
        console.error(`❌ Error processing ${id}:`, err.message);
        failed++;
      }
    }

    console.log('');
    console.log('══════════════════════════════════════════════');
    console.log(`Processed: ${processed}`);
    console.log(`Skipped:   ${skipped}`);
    console.log(`Failed:    ${failed}`);
    console.log(`Total:     ${entries.items.length}`);
    console.log('══════════════════════════════════════════════');
  } catch (err) {
    console.error('Fatal error:', err.message);
  }
}

/* ------------------------------------------------------------------ */
/*  EXTRACT ENTRY COPY                                                 */
/* ------------------------------------------------------------------ */

function extractEntryCopy(entry) {
  const f = entry.fields;
  return {
    id: entry.sys.id,
    title: f.title?.[LOCALE] || '',
    slug: f.slug?.[LOCALE] || '',
    description: f.description?.[LOCALE] || '',
    summary: f.summary?.[LOCALE] || '',
    role: f.role?.[LOCALE] || '',
    tags: f.tags?.[LOCALE] || [],
    startDate: f.startDate?.[LOCALE] || '',
    endDate: f.endDate?.[LOCALE] || '',
    content: f.content?.[LOCALE] || '',
  };
}

/* ------------------------------------------------------------------ */
/*  EXTRACT IMAGE REFERENCES                                           */
/* ------------------------------------------------------------------ */

function extractImageRefs(entry) {
  const refs = [];
  const f = entry.fields;

  // Hero image
  const hero = f.heroImage?.[LOCALE];
  if (hero?.sys?.id) {
    refs.push({
      id: hero.sys.id,
      url: null, // resolved later
      mimeType: null,
      alt: 'Hero image',
      source: 'heroImage',
    });
  }

  // Images embedded in markdown content
  const content = f.content?.[LOCALE] || '';
  const mdImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  let idx = 0;
  while ((match = mdImageRegex.exec(content)) !== null) {
    const alt = match[1] || `Inline image ${++idx}`;
    let url = match[2];

    // Extract asset ID from images.ctfassets.net URLs
    const assetIdMatch = url.match(/images\.ctfassets\.net\/[^/]+\/([^/]+)\//);
    const id = assetIdMatch ? assetIdMatch[1] : null;

    if (url.startsWith('//')) url = 'https:' + url;
    if (url.startsWith('/')) url = 'https://images.ctfassets.net' + url;

    // Guess mime type from extension
    let mimeType = 'image/jpeg';
    if (/\.png(\?|$)/i.test(url)) mimeType = 'image/png';
    else if (/\.gif(\?|$)/i.test(url)) mimeType = 'image/gif';
    else if (/\.webp(\?|$)/i.test(url)) mimeType = 'image/webp';
    else if (/\.svg(\?|$)/i.test(url)) mimeType = 'image/svg+xml';

    refs.push({
      id: id || `inline-${++idx}`,
      url,
      mimeType,
      alt,
      source: 'content',
    });
  }

  // If hero image has an ID but no URL yet, resolve it via Contentful
  // (handled below in the caller by fetching the asset URL — we do it here instead)
  return refs;
}

/* ------------------------------------------------------------------ */
/*  RESOLVE HERO IMAGE URLS                                            */
/* ------------------------------------------------------------------ */

// This is called before analysing to fill in hero image URLs.
async function resolveHeroImageUrl(environment, ref) {
  if (ref.url) return ref;
  try {
    const asset = await environment.getAsset(ref.id);
    const file = asset.fields.file?.[LOCALE] || asset.fields.file?.['en-GB'];
    if (file?.url) {
      ref.url = file.url.startsWith('//') ? 'https:' + file.url : file.url;
      ref.mimeType = file.contentType || 'image/jpeg';
    }
  } catch (err) {
    console.warn(`Could not resolve asset ${ref.id}:`, err.message);
  }
  return ref;
}

/* ------------------------------------------------------------------ */
/*  IMAGE ANALYSIS (Gemini)                                            */
/* ------------------------------------------------------------------ */

async function analyseImage(url, mimeType, alt) {
  if (!url) return null;

  let imageB64;
  try {
    imageB64 = await fetchBase64(url);
  } catch (err) {
    console.warn(`Could not fetch image ${url}:`, err.message);
    return null;
  }

  const prompt = [
    'You are analysing an image used in a professional UX/UI/Product design portfolio case study.',
    '',
    'Describe:',
    '1. What the image shows (type of artefact — wireframe, prototype, dashboard, before/after, component library, research board, persona, mock-up, etc.).',
    '2. What is visually prominent (main UI element, layout, information shown).',
    '3. The purpose it likely serves in a portfolio (e.g. "shows the redesigned dashboard grid", "demonstrates the drop-off analysis").',
    '',
    'Respond in STRICT JSON only:',
    '{ "type": "...", "summary": "...", "portfolioPurpose": "..." }',
    '',
    'Rules:',
    '- UK English spelling.',
    '- "summary" max 40 words.',
    '- "portfolioPurpose" max 30 words.',
    '- No markdown, no code fences, no extra keys.',
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
            model: GEMINI_MODEL,
            input: [
              { type: 'text', text: prompt },
              { type: 'image', data: imageB64, mime_type: mimeType || 'image/jpeg' },
            ],
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const text = extractText(data);
        if (text) {
          const parsed = parseJson(text);
          if (parsed?.summary) return parsed;
        }
      } else if (
        data?.error?.code === 'too_many_requests' ||
        response.status === 429
      ) {
        const waitMs = parseRetryMs(data?.error?.message) ?? DEFAULT_WAIT_MS;
        console.warn(
          `⏳ Rate limited (attempt ${attempt}) on ${alt}. Waiting ${Math.round(
            waitMs / 1000
          )}s...`
        );
        await sleep(waitMs);
        continue;
      } else {
        console.error(
          `Gemini error (attempt ${attempt}) on ${alt}:`,
          JSON.stringify(data).slice(0, 300)
        );
      }
    } catch (err) {
      console.error(`Network error (attempt ${attempt}):`, err.message);
    }

    await sleep(4000);
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  BLOG POST GENERATION (Gemini)                                      */
/* ------------------------------------------------------------------ */

async function improveBlogPost({ existing, imageAnalyses }) {
  const imageBlock = imageAnalyses.length
    ? imageAnalyses
        .map(
          (ia, i) =>
            `IMAGE ${i + 1}\n` +
            `- original alt: "${ia.ref.alt}"\n` +
            `- markdown to embed: ![${ia.ref.alt}](${ia.ref.url})\n` +
            `- type: ${ia.analysis.type || 'n/a'}\n` +
            `- summary: ${ia.analysis.summary || ''}\n` +
            `- purpose: ${ia.analysis.portfolioPurpose || ''}`
        )
        .join('\n\n')
    : '(No images available)';

  const prompt = `You are a senior portfolio writer and UX/Product design hiring manager.

Your task: rewrite a blog post for a professional UX/UI/Product/CRO portfolio so it fully demonstrates the author's skills, experience, process and impact. Produce a hiring-manager-grade case study.

## The author

- Based in London, UK.
- Roles across career: Web Manager, UX Designer, Product Designer, Product Owner, CRO Specialist, SEO Marketer, Front-end Developer, Digital Manager, Digital Experience Manager.
- Sectors: fintech (Equifax), healthcare (Medicspot), education (Lancaster University research), e-commerce (Volti Digital, Open Reply), enterprise B2B.
- Tools used across projects: GA4, Adobe Analytics, Glassbox, Hotjar, Qualtrics, Optimizely, SEMrush, Figma, Adobe XD, React, HTML5, CSS3, JavaScript, Node.js, WordPress, WooCommerce, C#/Windows Forms, Android/Java, PhoneGap, Cursor, GitHub, Jira.

## Existing blog post data

- Title: ${existing.title}
- Slug: ${existing.slug}
- Description: ${existing.description}
- Summary: ${existing.summary}
- Role stated: ${existing.role}
- Tags: ${existing.tags.join(', ') || '(none)'}
- Dates: ${existing.startDate} – ${existing.endDate}

### Existing content (markdown)

${existing.content}

## Images available (with AI-generated analysis)

${imageBlock}

## Your task

Rewrite the following fields:

1. **title** — clear, professional, specific. Keep the project name. No clickbait.
2. **summary** — 100–180 words, UK English. Lead with the problem, then what the author did, then the measurable result. Written for a hiring manager scanning quickly.
3. **content** — full markdown case study, minimum 800 words, no upper limit if the story needs more. This must be genuinely in-depth.

## Content structure to follow

Use this exact section order, using \`##\` for top-level sections:

1. **Project overview** — bullet list: Role(s), Duration, Team, Core skills demonstrated.
2. **A one-line "What this project proves about me:"** callout in a blockquote.
3. **The challenge** — the business / user problem. Why it mattered. Real constraints.
4. **My process** — numbered stages with clear names. Include: research, data, strategy, design, build, testing, iteration, launch. Choose stages that fit the project.
5. **What I did** — full narrative of the work, written in first person. Specific, concrete, technical where relevant.
6. **Why I made these decisions** — reasoning behind 3–5 key choices. This is what senior candidates show that juniors don't.
7. **Images in context** — every image must be embedded in the correct section with a short paragraph explaining what the reader is looking at and why it matters. Do NOT dump images at the bottom.
8. **Impact / results** — quantified outcomes where the existing copy supports it. Tables are welcome for metrics.
9. **Tools and skills applied** — a markdown table with Category | Tools / skills. Cover every tool that was used on this project.
10. **Roles performed on this project** — a short list, chosen from the list above, showing which disciplines the author personally owned.

## Tone and style rules

- UK English: optimise, colour, organisation, programme, prioritise, licence (noun), personalised.
- Professional, confident, specific. No hype. No "I'm passionate about".
- First person where it reads naturally ("I led", "I designed").
- Never say "I learned" unless it adds meaning. Focus on what was delivered.
- Do not invent metrics. If numbers are in the existing copy, use them; if not, describe the qualitative outcome honestly.
- Explain acronyms the first time (CRO, WCAG, GA4, CvR).
- Sentence length should vary. No bullet-point-only prose — use it strategically.
- Every image placeholder from the "Images available" block above MUST appear in the content exactly as given (same URL, same markdown syntax).

## Output format

Return STRICT JSON only, no markdown fences:

{
  "title": "...",
  "summary": "...",
  "content": "..."
}

The content field must contain escaped newlines (\\n) so it is valid JSON. Do not use triple backticks anywhere.`;

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
            model: GEMINI_MODEL,
            input: [{ type: 'text', text: prompt }],
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const text = extractText(data);
        if (text) {
          const parsed = parseJson(text);
          if (parsed?.title && parsed?.summary && parsed?.content) {
            return parsed;
          }
          console.warn(
            `Attempt ${attempt}: malformed JSON, retrying...`
          );
        } else {
          console.warn(
            `Attempt ${attempt}: empty response, retrying...`
          );
        }
      } else if (
        data?.error?.code === 'too_many_requests' ||
        response.status === 429
      ) {
        const waitMs = parseRetryMs(data?.error?.message) ?? DEFAULT_WAIT_MS;
        console.warn(
          `⏳ Rate limited (attempt ${attempt}). Waiting ${Math.round(
            waitMs / 1000
          )}s...`
        );
        await sleep(waitMs);
        continue;
      } else {
        console.error(
          `Gemini error (attempt ${attempt}):`,
          JSON.stringify(data).slice(0, 400)
        );
      }
    } catch (err) {
      console.error(`Network error (attempt ${attempt}):`, err.message);
    }

    await sleep(6000);
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

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

function parseJson(text) {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
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

async function fetchBase64(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

/* ------------------------------------------------------------------ */
/*  BOOTSTRAP                                                          */
/* ------------------------------------------------------------------ */

main();