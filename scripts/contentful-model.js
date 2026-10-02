#!/usr/bin/env node
/**
 * Creates the Contentful content model the redesigned site reads from, and seeds it with
 * the site's current copy so nothing changes visually after you run it.
 *
 *   node scripts/contentful-model.js            # dry run: prints what would change
 *   node scripts/contentful-model.js --apply    # makes the changes
 *   node scripts/contentful-model.js --apply --no-seed   # model only, no starter entries
 *
 * Needs CONTENTFUL_MANAGEMENT_TOKEN (Contentful → Settings → CMA tokens) plus the
 * GATSBY_CONTENTFUL_SPACE_ID already in .env. Optional: CONTENTFUL_ENVIRONMENT (default "master").
 *
 * Safe to re-run: it only adds missing content types/fields, never deletes or renames, and only
 * seeds a content type that has no entries yet. Existing entries (e.g. Landing) are never edited.
 * See docs/CONTENT-MODEL.md for what each field controls.
 */
const path = require('path')

try {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })
} catch (e) {
  /* dotenv is optional; env vars can be set directly */
}

const APPLY = process.argv.includes('--apply')
const SEED = !process.argv.includes('--no-seed')
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const SPACE = process.env.GATSBY_CONTENTFUL_SPACE_ID || process.env.CONTENTFUL_SPACE_ID
const ENV = process.env.CONTENTFUL_ENVIRONMENT || 'master'
const BASE = `https://api.contentful.com/spaces/${SPACE}/environments/${ENV}`

if (!TOKEN || !SPACE) {
  console.error('Missing CONTENTFUL_MANAGEMENT_TOKEN or GATSBY_CONTENTFUL_SPACE_ID. See docs/CONTENT-MODEL.md.')
  process.exit(1)
}

// ---------- Field helpers ----------
// Short text (Symbol) is used throughout so Gatsby exposes plain strings; Symbol holds up to 256 chars.
const text = (id, name, opts = {}) => ({ id, name, type: 'Symbol', localized: false, required: false, ...opts })
const int = (id, name, opts = {}) => ({ id, name, type: 'Integer', localized: false, required: false, ...opts })
const list = (id, name) => ({ id, name, type: 'Array', localized: false, required: false, items: { type: 'Symbol' } })
const media = (id, name, mime = 'image') => ({
  id,
  name,
  type: 'Link',
  linkType: 'Asset',
  localized: false,
  required: false,
  validations: [{ linkMimetypeGroup: [mime] }],
})

// ---------- Content model ----------
// Content type NAMES matter: Gatsby builds GraphQL type names from them (e.g. "Section Header" → ContentfulSectionHeader).
const CONTENT_TYPES = [
  {
    id: 'sectionHeader',
    name: 'Section Header',
    description: 'Label, heading and intro for one home page section. The key decides which section it controls.',
    displayField: 'title',
    fields: [
      text('key', 'Key', {
        required: true,
        validations: [{ unique: true }, { in: ['about', 'impact', 'expertise', 'experience', 'education', 'work', 'testimonials', 'contact'] }],
      }),
      text('eyebrow', 'Eyebrow (small label)'),
      text('title', 'Title', { required: true }),
      list('highlightWords', 'Highlight words (shown in the serif accent)'),
      text('intro', 'Intro'),
      text('buttonLabel', 'Button label (contact only)'),
    ],
  },
  {
    id: 'valuePillar',
    name: 'Value Pillar',
    description: 'One of the "What I bring" pillars under the About section.',
    displayField: 'title',
    fields: [text('title', 'Title', { required: true }), text('description', 'Description'), int('order', 'Order')],
  },
  {
    id: 'testimonial',
    name: 'Testimonial',
    description: 'A short quote shown in the testimonials section (hidden until at least one exists).',
    displayField: 'name',
    fields: [
      text('quote', 'Quote', { required: true }),
      text('name', 'Name', { required: true }),
      text('role', 'Role'),
      text('company', 'Company'),
      media('photo', 'Photo'),
      int('order', 'Order'),
    ],
  },
  {
    id: 'pageHeader',
    name: 'Page Header',
    description: 'Header copy, banner image and SEO for the Portfolio and Tools pages.',
    displayField: 'title',
    fields: [
      text('slug', 'Page', { required: true, validations: [{ unique: true }, { in: ['portfolio', 'tools'] }] }),
      text('eyebrow', 'Eyebrow (small label)'),
      text('title', 'Title', { required: true }),
      text('intro', 'Intro'),
      media('headerImage', 'Header banner image'),
      text('seoTitle', 'SEO title'),
      text('seoDescription', 'SEO description'),
    ],
  },
  {
    id: 'siteSettings',
    name: 'Site Settings',
    description: 'Site-wide copy, SEO and artwork. Create exactly one entry.',
    displayField: 'internalName',
    fields: [
      text('internalName', 'Internal name'),
      text('siteTitle', 'Site title'),
      text('siteDescription', 'Site description (search & social)'),
      media('socialShareImage', 'Social share image (1200 × 630)'),
      text('introLabel', 'Intro screen label'),
      text('heroPrimaryCtaLabel', 'Hero primary button'),
      text('heroSecondaryCtaLabel', 'Hero secondary button'),
      text('availability', 'Availability line (optional)'),
      media('cvFile', 'CV (PDF)', 'pdfdocument'),
      text('valuePillarsLabel', '"What I bring" label'),
      text('achievementsLabel', 'Key achievements label'),
      text('logoStripLabel', 'Logo strip label'),
      int('featuredProjectCount', 'Projects shown on home page'),
      media('aboutImage', 'About image'),
      text('aboutImageCaption', 'About image caption'),
      media('expertiseImage', 'Expertise card image'),
      media('contactImage', 'Contact image'),
      text('footerCopyright', 'Footer copyright'),
      text('notFoundTitle', '404 title'),
      text('notFoundButtonLabel', '404 button label'),
    ],
  },
]

// Extra fields on content types that already exist, matched by NAME
const EXTRA_FIELDS = {
  'Blog Post': [text('headlineResult', 'Headline result (e.g. +58% conversion)')],
}

// ---------- Starter content: today's copy, so the site looks the same after migrating ----------
const SEED_ENTRIES = {
  sectionHeader: [
    { key: 'about', eyebrow: 'About', title: 'Where user experience meets measurable growth.', highlightWords: ['growth.'] },
    { key: 'impact', eyebrow: 'Impact', title: 'Proven results, not just pretty pixels.', highlightWords: ['results,'], intro: 'Every project is measured by what it changes, for users and for the business.' },
    { key: 'expertise', eyebrow: 'Expertise', title: 'A rare blend of design, data and code.', highlightWords: ['code.'], intro: 'Strategy, optimisation and hands-on build skills in one person. Choose a discipline, then a skill, to see how it’s applied.' },
    { key: 'experience', eyebrow: 'Experience', title: 'A track record of delivering at scale.', highlightWords: ['scale.'], intro: 'From consultancy and research to leading UX and front-end development today: the teams and products I’ve helped grow.' },
    { key: 'education', eyebrow: 'Education', title: 'Built on a technical foundation.', highlightWords: ['foundation.'] },
    { key: 'work', eyebrow: 'Selected work', title: 'Real projects, measurable outcomes.', highlightWords: ['outcomes.'], intro: 'A selection of case studies: the challenge, the approach and the result it delivered.' },
    { key: 'contact', eyebrow: 'Contact', title: 'Let’s build an experience that performs.', highlightWords: ['performs.'], intro: 'Need someone who can shape the experience, prove it with data and build it too? Let’s talk about what you’re working on.', buttonLabel: 'Say hello' },
  ],
  valuePillar: [
    { title: 'Experience design', description: 'User-centred UX, from research and journey mapping to polished, accessible interfaces.', order: 1 },
    { title: 'Conversion & growth', description: 'Data-led CRO, A/B testing and analytics that turn traffic into measurable results.', order: 2 },
    { title: 'Front-end delivery', description: 'Hands-on development with modern web technology, so ideas ship quickly and scale.', order: 3 },
  ],
  pageHeader: [
    { slug: 'portfolio', eyebrow: 'Selected work', title: 'Case studies with measurable outcomes.', intro: 'A closer look at the challenges, the thinking and the outcomes behind each project.', seoTitle: 'Portfolio' },
    { slug: 'tools', eyebrow: 'Toolbox', title: 'Tools, experiments and resources.', intro: 'Things I have built or rely on — shared in case they help you too.', seoTitle: 'Tools' },
  ],
  siteSettings: [
    {
      internalName: 'Site settings',
      siteTitle: 'LING KAN',
      siteDescription: 'LING KAN — London-based digital experience leader combining UX, conversion optimisation and front-end development to drive measurable growth.',
      introLabel: 'Digital experience & growth',
      heroPrimaryCtaLabel: 'View selected work',
      heroSecondaryCtaLabel: 'Get in touch',
      valuePillarsLabel: 'What I bring',
      achievementsLabel: 'Key achievements',
      logoStripLabel: 'Organisations I’ve worked with',
      featuredProjectCount: 6,
      aboutImageCaption: 'Seeing the bigger picture',
      footerCopyright: 'LING KAN Portfolio. All rights reserved.',
      notFoundTitle: 'Sorry, this page can’t be found.',
      notFoundButtonLabel: 'Back to home',
    },
  ],
}

// ---------- Contentful Management API ----------
const api = async (method, url, { body, version, contentType } = {}) => {
  const headers = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/vnd.contentful.management.v1+json' }
  if (version !== undefined) headers['X-Contentful-Version'] = String(version)
  if (contentType) headers['X-Contentful-Content-Type'] = contentType
  const res = await fetch(`${BASE}${url}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`${method} ${url} → ${res.status} ${res.statusText}\n${detail}`)
  }
  return res.status === 204 ? null : res.json()
}

const log = (msg) => console.log(`${APPLY ? '✔' : '•'} ${msg}`)

const publishContentType = async (ct) => {
  const latest = await api('GET', `/content_types/${ct.sys.id}`)
  await api('PUT', `/content_types/${ct.sys.id}/published`, { version: latest.sys.version })
}

async function syncContentTypes(existing) {
  const byId = new Map(existing.map((ct) => [ct.sys.id, ct]))
  for (const def of CONTENT_TYPES) {
    const current = byId.get(def.id) || existing.find((ct) => ct.name === def.name)
    if (!current) {
      log(`Create content type "${def.name}" (${def.fields.length} fields)`)
      if (APPLY) {
        const { id, ...body } = def
        const created = await api('PUT', `/content_types/${id}`, { body })
        await publishContentType(created)
      }
      continue
    }
    await addMissingFields(current, def.fields)
  }
  for (const [name, fields] of Object.entries(EXTRA_FIELDS)) {
    const current = existing.find((ct) => ct.name === name)
    if (!current) {
      console.warn(`! Content type "${name}" not found — skipped extra fields: ${fields.map((f) => f.id).join(', ')}`)
      continue
    }
    await addMissingFields(current, fields)
  }
}

async function addMissingFields(current, fields) {
  const have = new Set(current.fields.map((f) => f.id))
  const missing = fields.filter((f) => !have.has(f.id))
  if (!missing.length) {
    log(`"${current.name}" is up to date`)
    return
  }
  log(`Add to "${current.name}": ${missing.map((f) => f.id).join(', ')}`)
  if (!APPLY) return
  const updated = await api('PUT', `/content_types/${current.sys.id}`, {
    version: current.sys.version,
    body: { name: current.name, description: current.description, displayField: current.displayField, fields: [...current.fields, ...missing] },
  })
  await publishContentType(updated)
}

async function seedEntries(locale) {
  for (const [typeId, entries] of Object.entries(SEED_ENTRIES)) {
    let count = 0
    try {
      count = (await api('GET', `/entries?content_type=${typeId}&limit=1`)).total
    } catch (e) {
      count = 0 // content type not created yet (dry run)
    }
    if (count > 0) {
      log(`"${typeId}" already has entries — not seeding`)
      continue
    }
    log(`Seed ${entries.length} "${typeId}" entr${entries.length === 1 ? 'y' : 'ies'} with the current site copy`)
    if (!APPLY) continue
    for (const values of entries) {
      const fields = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, { [locale]: v }]))
      const entry = await api('POST', '/entries', { body: { fields }, contentType: typeId })
      await api('PUT', `/entries/${entry.sys.id}/published`, { version: entry.sys.version })
    }
  }
}

async function main() {
  console.log(`${APPLY ? 'Applying' : 'Dry run (no changes)'}: space ${SPACE}, environment "${ENV}"\n`)
  const [{ items: contentTypes }, { items: locales }] = await Promise.all([
    api('GET', '/content_types?limit=1000'),
    api('GET', '/locales'),
  ])
  const locale = (locales.find((l) => l.default) || locales[0]).code

  await syncContentTypes(contentTypes)
  if (SEED) await seedEntries(locale)

  console.log(APPLY ? '\nDone. Restart `npm run dev` to load the new content.' : '\nNothing was changed. Re-run with --apply to make these changes.')
}

main().catch((err) => {
  console.error(`\n✖ ${err.message}`)
  if (/certificate/i.test(err.message) || /fetch failed/i.test(err.message)) {
    console.error('On the Equifax network, set NODE_EXTRA_CA_CERTS to your Netskope certificate file first (see docs/CONTENT-MODEL.md).')
  }
  process.exit(1)
})
