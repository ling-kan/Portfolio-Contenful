// node /Users/ling/Documents/GitHub/Portfolio-Contenful/scripts/2-improve-blogposts.js
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
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

const SKIP_IF_IMPROVED = process.env.FORCE_REGENERATE === '1' ? false : true;
const DRY_RUN = process.env.DRY_RUN === '1';
const IMPROVED_TAG = 'ai-improved';

const PRESERVE_STRONG_FIELDS = true;

/* ------------------------------------------------------------------ */
/*  IMAGE ANALYSIS POLICY                                              */
/* ------------------------------------------------------------------ */

const MIN_DESCRIPTION_WORDS = 15;
const UPDATE_ASSET_DESCRIPTION = true;
const UPDATE_ASSET_TITLE = true;
const ASSET_TITLE_MAX_LENGTH = 80;
const ONLY_FILL_MISSING_DESCRIPTIONS = false;
const ASSET_LOCALE = 'en-US';

/* ------------------------------------------------------------------ */
/*  RATE-LIMIT BEHAVIOUR                                               */
/* ------------------------------------------------------------------ */

const IMAGE_RATE_LIMIT_BEHAVIOUR = 'fallback';
const REWRITE_RATE_LIMIT_BEHAVIOUR = 'wait';

const RATE_LIMIT_BASE_WAIT_MS = 60000;
const RATE_LIMIT_MAX_WAIT_MS = 900000;
const RATE_LIMIT_MAX_ATTEMPTS = 20;

const MAX_RETRIES_OTHER_ERRORS = 3;
const OTHER_ERROR_WAIT_MS = 5000;

const MIN_GAP_BETWEEN_CALLS_MS = 20000;

const GEMINI_MODEL = 'gemini-3.8-flash';

/* ------------------------------------------------------------------ */
/*  MAIN                                                               */
/* ------------------------------------------------------------------ */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  try {
    await verifyModelExists();

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
    let rateLimited = 0;
    let imagesAnalysed = 0;
    let imagesSkipped = 0;
    let assetsUpdated = 0;
    let assetTitlesUpdated = 0;
    let imagesRestored = 0;
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
        const existing = extractEntryCopy(entry);
        const imageRefs = extractImageRefs(entry);
        console.log(`   Found ${imageRefs.length} image reference(s).`);

        for (const ref of imageRefs) {
          await enrichImageRef(environment, ref);
        }

        /* ---------- Analyse images (with skip check) ---------- */
        const imageAnalyses = [];

        for (const ref of imageRefs) {
          if (!needsAnalysis(ref)) {
            const words = (ref.assetDescription || '')
              .split(/\s+/)
              .filter(Boolean).length;
            console.log(
              `   ⏭️  Skipping analysis for "${ref.alt || ref.id}" — existing description is ${words} words.`
            );
            imagesSkipped++;
            imageAnalyses.push({
              ref,
              analysis: buildFallbackAnalysis(ref),
              usedExistingDescription: true,
            });
            continue;
          }

          const sinceLast = Date.now() - lastCallAt;
          if (sinceLast < MIN_GAP_BETWEEN_CALLS_MS) {
            await sleep(MIN_GAP_BETWEEN_CALLS_MS - sinceLast);
          }
          lastCallAt = Date.now();

          const { analysis, wasRateLimited } = await analyseImage(
            ref.url,
            ref.mimeType,
            ref.alt
          );

          if (wasRateLimited) rateLimited++;

          if (analysis) {
            imagesAnalysed++;
            console.log(
              `   ${wasRateLimited ? '✔ (after waits)' : '✔'} Analysed ${ref.alt || ref.id}`
            );

            if (
              (UPDATE_ASSET_DESCRIPTION || UPDATE_ASSET_TITLE) &&
              ref.id &&
              !ref.id.startsWith('inline-')
            ) {
              const result = await updateAsset(environment, ref, analysis);
              if (result.ok) assetsUpdated++;
              if (result.titleUpdated) assetTitlesUpdated++;
            } else if (UPDATE_ASSET_DESCRIPTION || UPDATE_ASSET_TITLE) {
              console.log('      (inline image — no asset to update)');
            }

            imageAnalyses.push({ ref, analysis });
          } else {
            console.log(`   ↺ Using fallback metadata for ${ref.alt || ref.id}`);
            imageAnalyses.push({ ref, analysis: buildFallbackAnalysis(ref) });
          }
        }

        /* ---------- Generate improved copy ---------- */
        const { result: improved, wasRateLimited: rewriteLimited } =
          await improveBlogPost({ existing, imageAnalyses });

        if (rewriteLimited) rateLimited++;

        if (!improved) {
          console.error(
            `❌ Failed to generate improved copy for ${id} — skipping.`
          );
          failed++;
          continue;
        }

        /* ---------- Sanity check: all images present? ---------- */
        const { content: fixedContent, restored } = ensureImagesPresent(
          improved.content,
          imageAnalyses
        );
        if (restored > 0) {
          imagesRestored += restored;
          improved.content = fixedContent;
        }

        /* ---------- Write back to Contentful ---------- */
        if (DRY_RUN) {
          console.log(`[DRY RUN] Would update ${id}`);
          console.log('  title:      ', improved.title);
          console.log('  slug:       ', improved.slug);
          console.log('  description:', improved.description);
          console.log('  role:       ', improved.role);
          console.log('  tags:       ', (improved.tags || []).join(', '));
          console.log('  summary:    ', (improved.summary || '').slice(0, 160) + '...');
          console.log('  content:    ', (improved.content || '').slice(0, 160) + '...');
          processed++;
          continue;
        }

        entry.fields.title = entry.fields.title || {};
        entry.fields.slug = entry.fields.slug || {};
        entry.fields.description = entry.fields.description || {};
        entry.fields.summary = entry.fields.summary || {};
        entry.fields.role = entry.fields.role || {};
        entry.fields.tags = entry.fields.tags || {};
        entry.fields.content = entry.fields.content || {};

        entry.fields.title[LOCALE] = improved.title;
        entry.fields.slug[LOCALE] = improved.slug;
        entry.fields.description[LOCALE] = improved.description;
        entry.fields.summary[LOCALE] = improved.summary;
        entry.fields.role[LOCALE] = improved.role;
        entry.fields.content[LOCALE] = improved.content;

        const newTags = Array.from(
          new Set([...(improved.tags || existingTags), IMPROVED_TAG])
        );
        entry.fields.tags[LOCALE] = newTags;

        const updated = await entry.update();
        await updated.publish();

        console.log(`✅ Updated ${id}`);
        console.log(`   title: ${improved.title}`);
        processed++;

        await sleep(1500);
      } catch (err) {
        console.error(`❌ Error processing ${id}:`, err.message);
        failed++;
      }
    }

    console.log('');
    console.log('══════════════════════════════════════════════');
    console.log(`Posts processed:   ${processed}`);
    console.log(`Posts skipped:     ${skipped}`);
    console.log(`Posts failed:      ${failed}`);
    console.log(`Rate limited:      ${rateLimited} (recovered after waits)`);
    console.log('─── Images ───────────────────────────────────');
    console.log(`Images analysed:   ${imagesAnalysed}`);
    console.log(`Images skipped:    ${imagesSkipped} (existing description was fine)`);
    console.log(`Images restored:   ${imagesRestored} (AI dropped them, script re-added)`);
    console.log('─── Assets ───────────────────────────────────');
    console.log(`Assets updated:    ${assetsUpdated}`);
    console.log(`  └─ titles:       ${assetTitlesUpdated}`);
    console.log(`Total posts:       ${entries.items.length}`);
    console.log('══════════════════════════════════════════════');
  } catch (err) {
    console.error('Fatal error:', err.message);
  }
}

/* ------------------------------------------------------------------ */
/*  STARTUP CHECK                                                      */
/* ------------------------------------------------------------------ */

async function verifyModelExists() {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models?key=` +
    process.env.GEMINI_API_KEY;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || data.error) {
    console.error('❌ Could not list Gemini models:');
    console.error(JSON.stringify(data.error || data, null, 2));
    process.exit(1);
  }

  const names = (data.models || []).map((m) => m.name.replace('models/', ''));
  const wanted = GEMINI_MODEL;

  if (!names.includes(wanted)) {
    console.error(`\n❌ Model "${wanted}" is not available for your API key.\n`);
    console.error('Available models:');
    names.forEach((n) => console.error('  - ' + n));
    console.error(
      `\nUpdate GEMINI_MODEL in this script to one of the names above.\n`
    );
    process.exit(1);
  }

  console.log(`✔ Model "${wanted}" is available.`);
  console.log('');
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
/*  EXTRACT IMAGE REFERENCES (with source position context)            */
/* ------------------------------------------------------------------ */

function extractImageRefs(entry) {
  const refs = [];
  const f = entry.fields;

  /* ------------------- Hero image ------------------- */
  const hero = f.heroImage?.[LOCALE];
  if (hero?.sys?.id) {
    refs.push({
      id: hero.sys.id,
      url: null,
      mimeType: null,
      alt: 'Hero image',
      assetTitle: '',
      assetDescription: '',
      source: 'heroImage',
      position: null,
      contextHeading: '',
      contextBefore: '',
      contextAfter: '',
    });
  }

  /* ---------------- Inline images -------------------- */
  const content = f.content?.[LOCALE] || '';
  const mdImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  let idx = 0;

  while ((match = mdImageRegex.exec(content)) !== null) {
    const alt = match[1] || `Inline image ${++idx}`;
    let url = match[2];
    const matchIndex = match.index;

    const assetIdMatch = url.match(/images\.ctfassets\.net\/[^/]+\/([^/]+)\//);
    const id = assetIdMatch ? assetIdMatch[1] : null;

    if (url.startsWith('//')) url = 'https:' + url;
    if (url.startsWith('/')) url = 'https://images.ctfassets.net' + url;

    let mimeType = 'image/jpeg';
    if (/\.png(\?|$)/i.test(url)) mimeType = 'image/png';
    else if (/\.gif(\?|$)/i.test(url)) mimeType = 'image/gif';
    else if (/\.webp(\?|$)/i.test(url)) mimeType = 'image/webp';
    else if (/\.svg(\?|$)/i.test(url)) mimeType = 'image/svg+xml';

    const before = content.slice(0, matchIndex);
    const after = content.slice(matchIndex + match[0].length);

    refs.push({
      id: id || `inline-${++idx}`,
      url,
      mimeType,
      alt,
      assetTitle: '',
      assetDescription: '',
      source: 'content',
      position: idx,
      contextHeading: findNearestHeading(before),
      contextBefore: findLastParagraph(before),
      contextAfter: findFirstParagraph(after),
    });
  }

  return refs;
}

/* ------------------------------------------------------------------ */
/*  CONTEXT HELPERS                                                    */
/* ------------------------------------------------------------------ */

function findNearestHeading(text) {
  const headings = [...text.matchAll(/^#{1,6}\s+(.+)$/gm)];
  if (!headings.length) return '';
  return headings[headings.length - 1][1].trim();
}

function findLastParagraph(text) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b && !b.startsWith('#') && !b.startsWith('!['));
  return blocks[blocks.length - 1] || '';
}

function findFirstParagraph(text) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b && !b.startsWith('#') && !b.startsWith('!['));
  return blocks[0] || '';
}

/* ------------------------------------------------------------------ */
/*  ENRICH IMAGE REF                                                   */
/* ------------------------------------------------------------------ */

async function enrichImageRef(environment, ref) {
  if (!ref.id || ref.id.startsWith('inline-')) return ref;

  try {
    const asset = await environment.getAsset(ref.id);
    const file = asset.fields.file?.[LOCALE] || asset.fields.file?.['en-GB'];

    if (file?.url && !ref.url) {
      ref.url = file.url.startsWith('//') ? 'https:' + file.url : file.url;
      ref.mimeType = file.contentType || ref.mimeType || 'image/jpeg';
    }

    ref.assetTitle =
      asset.fields.title?.[LOCALE] || asset.fields.title?.['en-GB'] || '';

    ref.assetDescription =
      asset.fields.description?.[LOCALE] ||
      asset.fields.description?.['en-GB'] ||
      '';
  } catch (err) {
    console.warn(`Could not enrich asset ${ref.id}:`, err.message);
  }

  return ref;
}

/* ------------------------------------------------------------------ */
/*  DECIDE WHETHER AN IMAGE NEEDS ANALYSIS                             */
/* ------------------------------------------------------------------ */

function needsAnalysis(ref) {
  const desc = (ref.assetDescription || '').trim();
  if (!desc) return true;
  if (ONLY_FILL_MISSING_DESCRIPTIONS) return false;
  const wordCount = desc.split(/\s+/).filter(Boolean).length;
  return wordCount < MIN_DESCRIPTION_WORDS;
}

/* ------------------------------------------------------------------ */
/*  WRITE ALT TEXT + TITLE BACK TO THE ASSET                           */
/* ------------------------------------------------------------------ */

async function updateAsset(environment, ref, analysis) {
  if (!ref.id || ref.id.startsWith('inline-')) {
    return { ok: false, titleUpdated: false };
  }

  try {
    const asset = await environment.getAsset(ref.id);

    /* ------------------- Description ------------------- */
    let descriptionUpdated = false;
    let newDescription = '';

    if (UPDATE_ASSET_DESCRIPTION) {
      newDescription =
        (analysis.summary || '').trim() ||
        (analysis.portfolioPurpose || '').trim() ||
        ref.alt ||
        '';

      if (newDescription) {
        asset.fields.description = asset.fields.description || {};
        asset.fields.description[ASSET_LOCALE] = newDescription;
        descriptionUpdated = true;
      } else {
        console.log(
          `      ↺ No description generated for ${ref.id}, skipping description update.`
        );
      }
    }

    /* ---------------------- Title ---------------------- */
    const forceRewrite = descriptionUpdated;
    let titleUpdated = false;

    if (UPDATE_ASSET_TITLE) {
      asset.fields.title = asset.fields.title || {};

      const existingTitle = (asset.fields.title[ASSET_LOCALE] || '').trim();
      const proposedTitle = buildAssetTitle(
        ref,
        analysis,
        existingTitle,
        forceRewrite
      );

      if (proposedTitle && proposedTitle !== existingTitle) {
        asset.fields.title[ASSET_LOCALE] = proposedTitle;
        titleUpdated = true;
      }
    }

    if (!titleUpdated && !descriptionUpdated) {
      console.log(`      ↺ Nothing to update on ${ref.id}.`);
      return { ok: false, titleUpdated: false };
    }

    /* -------------------- Save + publish ---------------- */
    const updated = await asset.update();
    await updated.publish();

    const titlePreview = titleUpdated
      ? ` title: "${asset.fields.title[ASSET_LOCALE]}"`
      : '';
    const descPreview = descriptionUpdated
      ? ` description: "${truncate(newDescription, 70)}"`
      : '';

    console.log(`      📝 Updated asset ${ref.id}:${titlePreview}${descPreview}`);
    return { ok: true, titleUpdated };
  } catch (err) {
    console.warn(`      ⚠️  Could not update asset ${ref.id}:`, err.message);
    return { ok: false, titleUpdated: false };
  }
}

/* ------------------------------------------------------------------ */
/*  BUILD ASSET TITLE                                                  */
/* ------------------------------------------------------------------ */

function buildAssetTitle(ref, analysis, existingTitle, forceRewrite) {
  if (
    !forceRewrite &&
    existingTitle &&
    !/^(hero image|inline image \d+|untitled image)$/i.test(existingTitle)
  ) {
    return existingTitle;
  }

  if (!forceRewrite) {
    const alt = (ref.alt || '').trim();
    if (alt && !/^(hero image|inline image \d+)$/i.test(alt)) {
      return truncate(alt, ASSET_TITLE_MAX_LENGTH);
    }
  }

  const seed = (analysis.type || '').trim() || (analysis.summary || '').trim();
  if (!seed) return existingTitle || '';

  const firstSentence = seed.split(/[.!?]/)[0].trim();
  const titled =
    firstSentence.charAt(0).toUpperCase() + firstSentence.slice(1);
  return truncate(titled, ASSET_TITLE_MAX_LENGTH);
}

function truncate(str, max) {
  if (!str) return '';
  if (str.length <= max) return str;
  return str.slice(0, max - 1).trimEnd() + '…';
}

/* ------------------------------------------------------------------ */
/*  ENSURE ALL IMAGES ARE PRESENT IN REWRITTEN CONTENT                 */
/* ------------------------------------------------------------------ */

function ensureImagesPresent(content, imageAnalyses) {
  let restored = 0;

  // Any image whose URL doesn't appear in the rewritten content?
  const missing = imageAnalyses.filter(
    (ia) => ia.ref.url && !content.includes(ia.ref.url)
  );

  if (missing.length === 0) {
    return { content, restored: 0 };
  }

  console.log(
    `   ⚠️  ${missing.length} image(s) missing from rewritten content — appending before "Impact".`
  );
  missing.forEach((ia) =>
    console.log(`      - ${ia.ref.alt} (${ia.ref.url})`)
  );

  const appendix = missing
    .map((ia) => {
      const summary = ia.analysis.summary || ia.ref.alt || '';
      return `\n\n![${ia.ref.alt}](${ia.ref.url})\n\n> ${summary}`;
    })
    .join('');

  // Try to insert before "## Impact". Fall back to appending at end.
  if (/^##\s+Impact/m.test(content)) {
    content = content.replace(/(^##\s+Impact)/m, `${appendix}\n\n$1`);
  } else {
    content += appendix;
  }

  restored = missing.length;
  return { content, restored };
}

/* ------------------------------------------------------------------ */
/*  FALLBACK ANALYSIS                                                  */
/* ------------------------------------------------------------------ */

function buildFallbackAnalysis(ref) {
  const title = ref.assetTitle || ref.alt || '';
  const description = ref.assetDescription || '';

  return {
    type: 'image',
    summary: description || title || 'Portfolio image from this project.',
    portfolioPurpose:
      description || title || 'Illustrates a stage of the project.',
    _fallback: true,
  };
}

/* ------------------------------------------------------------------ */
/*  RATE-LIMIT BACKOFF HELPER                                          */
/* ------------------------------------------------------------------ */

function computeBackoffMs(attempt) {
  const base = RATE_LIMIT_BASE_WAIT_MS * Math.pow(1.5, attempt - 1);
  const jitter = Math.random() * 15000;
  return Math.min(base + jitter, RATE_LIMIT_MAX_WAIT_MS);
}

/* ------------------------------------------------------------------ */
/*  IMAGE ANALYSIS                                                     */
/* ------------------------------------------------------------------ */

async function analyseImage(url, mimeType, alt) {
  if (!url) return { analysis: null, wasRateLimited: false };

  let imageB64;
  try {
    imageB64 = await fetchBase64(url);
  } catch (err) {
    console.warn(`Could not fetch image ${url}:`, err.message);
    return { analysis: null, wasRateLimited: false };
  }

  const prompt = [
    'You are analysing an image used in a professional UX/UI/Product design portfolio case study.',
    '',
    'Describe:',
    '1. What the image shows (type of artefact — wireframe, prototype, dashboard, before/after, component library, research board, persona, mock-up, etc.).',
    '2. What is visually prominent (main UI element, layout, information shown).',
    '3. The purpose it likely serves in a portfolio.',
    '',
    'Respond in STRICT JSON only:',
    '{ "type": "...", "summary": "...", "portfolioPurpose": "..." }',
    '',
    'Rules:',
    '- UK English spelling.',
    '- "type" max 6 words — short noun phrase, e.g. "Wireframe", "Analytics dashboard", "Before/after comparison".',
    '- "summary" max 40 words — one sentence describing what the image shows.',
    '- "portfolioPurpose" max 30 words — why it matters in a portfolio.',
    '- No markdown, no code fences, no extra keys.',
  ].join('\n');

  let wasRateLimited = false;
  let rateLimitAttempts = 0;
  let otherErrorAttempts = 0;

  while (true) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inline_data: {
                      mime_type: mimeType || 'image/jpeg',
                      data: imageB64,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      const bodyText = await response.text();

      if (response.status === 429) {
        wasRateLimited = true;
        rateLimitAttempts++;

        if (
          IMAGE_RATE_LIMIT_BEHAVIOUR === 'fallback' ||
          rateLimitAttempts >= RATE_LIMIT_MAX_ATTEMPTS
        ) {
          return { analysis: null, wasRateLimited };
        }

        const waitMs = computeBackoffMs(rateLimitAttempts);
        console.warn(
          `⏳ Rate limited (attempt ${rateLimitAttempts}/${RATE_LIMIT_MAX_ATTEMPTS}) on ${alt}. Waiting ${Math.round(waitMs / 1000)}s...`
        );
        await sleep(waitMs);
        continue;
      }

      if (response.status === 404) {
        console.error(`\n❌ FATAL: Model "${GEMINI_MODEL}" no longer exists.`);
        console.error(`   Google said: ${bodyText.slice(0, 300)}\n`);
        process.exit(1);
      }

      if (!response.ok) {
        otherErrorAttempts++;
        console.error(
          `Gemini HTTP ${response.status} (attempt ${otherErrorAttempts}/${MAX_RETRIES_OTHER_ERRORS}) on ${alt}:`,
          bodyText.slice(0, 200)
        );
        if (otherErrorAttempts >= MAX_RETRIES_OTHER_ERRORS) {
          return { analysis: null, wasRateLimited };
        }
        await sleep(OTHER_ERROR_WAIT_MS);
        continue;
      }

      let data;
      try {
        data = JSON.parse(bodyText);
      } catch {
        otherErrorAttempts++;
        console.error(`Gemini returned non-JSON on ${alt}.`);
        if (otherErrorAttempts >= MAX_RETRIES_OTHER_ERRORS) {
          return { analysis: null, wasRateLimited };
        }
        await sleep(OTHER_ERROR_WAIT_MS);
        continue;
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const parsed = parseJson(text);
        if (parsed?.summary) return { analysis: parsed, wasRateLimited };
      }

      otherErrorAttempts++;
      if (otherErrorAttempts >= MAX_RETRIES_OTHER_ERRORS) {
        return { analysis: null, wasRateLimited };
      }
      await sleep(OTHER_ERROR_WAIT_MS);
    } catch (err) {
      otherErrorAttempts++;
      console.error(
        `Network error (attempt ${otherErrorAttempts}/${MAX_RETRIES_OTHER_ERRORS}) on ${alt}:`,
        err.message
      );
      if (otherErrorAttempts >= MAX_RETRIES_OTHER_ERRORS) {
        return { analysis: null, wasRateLimited };
      }
      await sleep(OTHER_ERROR_WAIT_MS);
    }
  }
}

/* ------------------------------------------------------------------ */
/*  BLOG POST GENERATION                                               */
/* ------------------------------------------------------------------ */

async function improveBlogPost({ existing, imageAnalyses }) {
  const imageBlock = imageAnalyses.length
    ? imageAnalyses
        .map((ia, i) => {
          const lines = [
            `IMAGE ${i + 1} (${
              ia.ref.source === 'heroImage'
                ? 'HERO IMAGE'
                : `INLINE IMAGE #${ia.ref.position}`
            })`,
            `- original alt text: "${ia.ref.alt}"`,
            `- markdown to embed EXACTLY as given: ![${ia.ref.alt}](${ia.ref.url})`,
            `- analysis source: ${
              ia.analysis._fallback
                ? 'asset metadata (AI could not inspect)'
                : 'AI analysis of the image'
            }`,
            `- type: ${ia.analysis.type || 'n/a'}`,
            `- summary: ${ia.analysis.summary || ''}`,
            `- portfolio purpose: ${ia.analysis.portfolioPurpose || ''}`,
          ];

          if (ia.ref.contextHeading) {
            lines.push(
              `- ORIGINAL LOCATION — under heading: "${ia.ref.contextHeading}"`
            );
          }
          if (ia.ref.contextBefore) {
            lines.push(
              `- ORIGINAL LOCATION — paragraph immediately BEFORE: "${truncate(
                ia.ref.contextBefore,
                200
              )}"`
            );
          }
          if (ia.ref.contextAfter) {
            lines.push(
              `- ORIGINAL LOCATION — paragraph immediately AFTER: "${truncate(
                ia.ref.contextAfter,
                200
              )}"`
            );
          }

          return lines.join('\n');
        })
        .join('\n\n')
    : '(No images available)';

  const preservationRule = PRESERVE_STRONG_FIELDS
    ? `
## Field-by-field rewrite policy

For EACH field, decide whether the existing value is already strong.

- If it is already strong, clear, professional and accurate → return the existing value UNCHANGED.
- If it is weak, vague, misspelled, off-tone, incomplete, or missing → rewrite it.

Never rewrite a field just to prove you can.

Guidance per field:
- **title**: keep the project name. Only change if misleading or awkward.
- **slug**: keep it short, lowercase, hyphenated.
- **description**: 1 sentence, 15–30 words.
- **role**: disciplines the author personally owned on this project.
- **tags**: 3–6 short Title Case tags.
- **summary**: 100–180 words, problem → approach → result.
- **content**: full markdown case study. Never leave empty.
`
    : '';

  const prompt = `You are a senior portfolio writer and UX/Product design hiring manager.

Your task: improve a blog post for a professional UX/UI/Product/CRO portfolio so it fully demonstrates the author's skills, experience, process and impact. Produce a hiring-manager-grade case study.

## The author

- Based in London, UK.
- Roles across career: Web Manager, UX Designer, Product Designer, Product Owner, CRO Specialist, SEO Marketer, Front-end Developer, Digital Manager, Digital Experience Manager, Developer, Product Manager.
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

## Images available

${imageBlock}

> Note: If any image is marked "source: asset metadata", the AI was unable to inspect it. Use its existing title/description to describe it accurately in context. Do not invent visual detail you can't verify.

## Image placement rules

Each image above includes its ORIGINAL LOCATION — the heading it sat under
and the paragraphs immediately before and after it. Respect this placement.

- If an image was under the heading "My process", place it in your rewritten
  "My process" section — not in "Impact / results" or anywhere else.
- If an image had a paragraph before it explaining a specific decision, put
  the image right after the equivalent paragraph in your rewrite.
- Preserve the ORDER of inline images: IMAGE 1, IMAGE 2, IMAGE 3 must appear
  in the content in that relative order, unless the original order is clearly
  wrong for the new structure.
- The HERO IMAGE goes near the top, after the "What this project proves about
  me" callout, before "The challenge".
- Do NOT dump images at the bottom of the content.
- Do NOT invent new images or drop any of the images listed above.
- Embed each image exactly as: ![original alt text](original URL) — do not
  rewrite the alt text or the URL.

If an image's original location doesn't map cleanly to your new 10-section
structure, place it in the most semantically-similar section and keep it
adjacent to the paragraph it originally accompanied.

${preservationRule}
## What you must return

Return ALL of these fields:

- **title**
- **slug**
- **description**
- **role**
- **tags** (array of strings)
- **summary**
- **content** (full markdown case study)

## Content structure to follow

Use this exact section order in the \`content\` field, using \`##\` for top-level sections:

1. **Project overview** — bullet list: Role(s), Duration, Team, Core skills demonstrated.
2. **A one-line "What this project proves about me:"** callout in a blockquote.
3. **The challenge** — the business / user problem. Why it mattered. Real constraints.
4. **My process** — numbered stages with clear names.
5. **What I did** — full narrative of the work, first person, specific and technical.
6. **Why I made these decisions** — reasoning behind 3–5 key choices.
7. **Images in context** — every image embedded in the correct section with a short paragraph explaining what the reader is looking at and why it matters. Do NOT dump images at the bottom.
8. **Impact / results** — quantified outcomes where the existing copy supports it. Tables welcome.
9. **Tools and skills applied** — markdown table: Category | Tools / skills.
10. **Roles performed on this project** — a short list.

## Tone and style rules

- UK English: optimise, colour, organisation, programme, prioritise, licence (noun), personalised.
- Professional, confident, technical, analytical, specific. No hype.
- First person where it reads naturally ("I led", "I designed").
- Do not invent metrics.
- Explain acronyms the first time (CRO, WCAG, GA4, CvR).
- Every image from the "Images available" block above MUST appear in the content exactly as given, at a location that reflects its ORIGINAL LOCATION.

## Output format

Return STRICT JSON only, no markdown fences:

{
  "title": "...",
  "slug": "...",
  "description": "...",
  "role": "...",
  "tags": ["...", "..."],
  "summary": "...",
  "content": "..."
}

The \`content\` field must use escaped newlines (\\n) so it is valid JSON.`;

  let wasRateLimited = false;
  let rateLimitAttempts = 0;
  let otherErrorAttempts = 0;

  while (true) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const bodyText = await response.text();

      if (response.status === 429) {
        wasRateLimited = true;
        rateLimitAttempts++;

        if (
          REWRITE_RATE_LIMIT_BEHAVIOUR === 'skip' ||
          rateLimitAttempts >= RATE_LIMIT_MAX_ATTEMPTS
        ) {
          return { result: null, wasRateLimited };
        }

        const waitMs = computeBackoffMs(rateLimitAttempts);
        console.warn(
          `⏳ Rate limited on rewrite (attempt ${rateLimitAttempts}/${RATE_LIMIT_MAX_ATTEMPTS}). Waiting ${Math.round(waitMs / 1000)}s before retrying...`
        );
        await sleep(waitMs);
        continue;
      }

      if (response.status === 404) {
        console.error(`\n❌ FATAL: Model "${GEMINI_MODEL}" no longer exists.`);
        console.error(`   Google said: ${bodyText.slice(0, 300)}\n`);
        process.exit(1);
      }

      if (!response.ok) {
        otherErrorAttempts++;
        console.error(
          `Gemini HTTP ${response.status} (attempt ${otherErrorAttempts}/${MAX_RETRIES_OTHER_ERRORS}):`,
          bodyText.slice(0, 300)
        );
        if (otherErrorAttempts >= MAX_RETRIES_OTHER_ERRORS) {
          return { result: null, wasRateLimited };
        }
        await sleep(OTHER_ERROR_WAIT_MS);
        continue;
      }

      let data;
      try {
        data = JSON.parse(bodyText);
      } catch {
        otherErrorAttempts++;
        console.error(`Gemini returned non-JSON.`);
        if (otherErrorAttempts >= MAX_RETRIES_OTHER_ERRORS) {
          return { result: null, wasRateLimited };
        }
        await sleep(OTHER_ERROR_WAIT_MS);
        continue;
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const parsed = parseJson(text);
        if (
          parsed?.title &&
          parsed?.summary &&
          parsed?.content &&
          typeof parsed.slug === 'string' &&
          typeof parsed.description === 'string' &&
          typeof parsed.role === 'string' &&
          Array.isArray(parsed.tags)
        ) {
          return { result: parsed, wasRateLimited };
        }
      }

      otherErrorAttempts++;
      if (otherErrorAttempts >= MAX_RETRIES_OTHER_ERRORS) {
        return { result: null, wasRateLimited };
      }
      await sleep(OTHER_ERROR_WAIT_MS);
    } catch (err) {
      otherErrorAttempts++;
      console.error(
        `Network error (attempt ${otherErrorAttempts}/${MAX_RETRIES_OTHER_ERRORS}):`,
        err.message
      );
      if (otherErrorAttempts >= MAX_RETRIES_OTHER_ERRORS) {
        return { result: null, wasRateLimited };
      }
      await sleep(OTHER_ERROR_WAIT_MS);
    }
  }
}

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

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