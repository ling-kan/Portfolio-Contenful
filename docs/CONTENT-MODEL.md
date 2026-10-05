# Content model — managing the whole site in Contentful

All copy, images and SEO for the site are editable in Contentful. This guide covers:

1. [Running the migration](#1-run-the-migration) that creates the new content types
2. [What each content type and field controls](#2-content-types-reference)
3. [How fallbacks work](#3-how-fallbacks-work) (the site never breaks while content is missing)
4. [Building and running the site](#4-build-and-run)

---

## 1. Run the migration

`scripts/contentful-model.js` creates the new content types, adds new fields to Landing and Blog Post, then seeds the
new types with the site’s current copy so nothing changes visually. It is **safe to re-run**: it only adds what is missing, never deletes or renames
anything, never edits existing entries, and only seeds a content type that has no entries yet.

### a) Create a management token

Contentful → **Settings → CMA tokens → Create personal access token**. Copy it.
This is *not* the delivery key already in `.env`. Never commit it.

### b) Set it for your terminal session (PowerShell)

```powershell
$env:CONTENTFUL_MANAGEMENT_TOKEN = "paste-token-here"
# Equifax network only — lets Node trust the Netskope certificate:
$env:NODE_EXTRA_CA_CERTS = "C:\Users\lxk132\netskope-ca.pem"
```

The space ID is read from `GATSBY_CONTENTFUL_SPACE_ID` in `.env`. To target a different environment than `master`,
also set `$env:CONTENTFUL_ENVIRONMENT = "your-env"`.

### c) Preview, then apply

```powershell
node scripts/contentful-model.js            # dry run — lists every change, writes nothing
node scripts/contentful-model.js --apply    # create content types, add fields, seed starter entries
```

Use `--apply --no-seed` to create the model without starter entries.

### d) Restart the dev server

```powershell
npm run dev
```

Gatsby reads the new content on start-up. After this, edit everything in Contentful.

---

## 2. Content types reference

> **Don't rename the content types.** Gatsby derives GraphQL type names from them
> (e.g. "Section Header" → `ContentfulSectionHeader`). Field *IDs* must also stay the same.
> Text fields are short text (max 256 characters) so they stay simple strings.

### Already existing (unchanged)

| Content type | Controls |
|---|---|
| **Landing** | Name, roles (rotating line), tagline, bio, portrait, key metrics, skills, key achievements (+ new site-wide fields, below) |
| **Timeline** / **Education** | Experience and education entries, company logos |
| **Blog Post** | Case studies (+ new field `headlineResult`, below) |
| **Tools**, **Navigation**, **Socials** | Tools page cards, menu links, social links |

### Section Header — one entry per home page section

| Field | Example | Notes |
|---|---|---|
| `key` | `impact` | Which section it controls. One of: `about`, `impact`, `expertise`, `experience`, `education`, `work`, `testimonials`, `contact` |
| `eyebrow` | Impact | Small label above the title |
| `title` | Proven results, not just pretty pixels. | Section heading |
| `highlightWords` | `results,` | Word(s) shown in the Playfair serif accent. Must match the word in the title, including punctuation |
| `intro` | Every project is measured by… | Paragraph under the heading (optional) |
| `buttonLabel` | Say hello | Contact section button only |

### Value Pillar — the "What I bring" cards under About

| Field | Notes |
|---|---|
| `title` | e.g. Experience design |
| `description` | One or two sentences |
| `order` | 1, 2, 3… (display order). Use 3 or 4 pillars; 2/4 lay out in two columns |

### Testimonial — shows a Testimonials section once at least one exists

| Field | Notes |
|---|---|
| `quote` | Up to 256 characters |
| `name`, `role`, `company` | Attribution |
| `photo` | Optional square headshot |
| `order` | Display order |

### Page Header — Portfolio and Tools pages

| Field | Notes |
|---|---|
| `slug` | `portfolio` or `tools` |
| `eyebrow`, `title`, `intro` | Header copy |
| `headerImage` | Wide banner (2400 × 1000) shown under the header |
| `seoTitle`, `seoDescription` | Browser tab title and search snippet for that page |

### Landing — new site-wide fields

These are added to your existing **Landing** entry, so all site-wide copy, SEO and artwork lives in one place.
The migration adds the fields but leaves them empty (it never edits existing entries); until you fill one in, the
site shows the current copy as a default.

| Field | Controls |
|---|---|
| `siteTitle`, `siteDescription` | Default browser title and search/social description |
| `socialShareImage` | Preview image when your link is shared (1200 × 630) |
| `introLabel` | Text on the intro (loading) screen |
| `heroPrimaryCtaLabel`, `heroSecondaryCtaLabel` | Hero buttons |
| `availability` | Optional line under the hero buttons and in Contact, e.g. "Open to senior UX roles in London" |
| `cvFile` | Optional PDF — adds a "Download CV" link in the hero |
| `valuePillarsLabel`, `achievementsLabel`, `logoStripLabel` | Small section labels |
| `featuredProjectCount` | How many case studies the home page shows (default 6) |
| `aboutImage`, `aboutImageCaption` | Image + caption beside your bio (replaces the illustration) |
| `expertiseImage` | Banner at the top of the dark skill card |
| `contactImage` | Image behind the "Say hello" button |
| `footerCopyright` | Footer text after the © year |
| `notFoundTitle`, `notFoundButtonLabel` | 404 page |

### Blog Post — new field

| Field | Notes |
|---|---|
| `headlineResult` | e.g. "+58% conversion". Shown as a badge on the project tile |

Image prompts for the AI artwork slots are in [`IMAGERY.md`](../IMAGERY.md).

---

## 3. How fallbacks work

- `gatsby-node.js` declares every new type and field, so builds work **before** you run the migration — queries
  just come back empty.
- Every component has the current copy as a default. Any empty field (or missing entry) shows that default.
- Images: a Contentful upload wins; otherwise a file in `static/images/` (see `IMAGERY.md`); otherwise a dashed
  placeholder in development and the existing design in production.

Small interface labels ("Read more", "Back to top", "Previous / Next", "Role / Duration") stay in the code on
purpose — they rarely change.

---

## 4. Build and run

```powershell
# One-time on the Equifax network: internal npm registry + Netskope certificate
npm config set registry https://nrm.us.equifax.com/repository/efxnpm/
npm config set cafile "C:\Users\lxk132\netskope-ca.pem"

# Each new terminal
$env:NODE_EXTRA_CA_CERTS = "C:\Users\lxk132\netskope-ca.pem"

npm install          # first time only
npm run dev          # http://localhost:8000
npm run build        # production build into ./public
```

`.env.development` (and `.env.production` for builds) must contain `GATSBY_CONTENTFUL_SPACE_ID`,
`GATSBY_CONTENTFUL_ACCESS_TOKEN`, `GATSBY_PORTFOLIO_ACCESS_PASS` and `GATSBY_GOOGLE_ANALYTICS_TRACKING_ID`.
Netlify builds use the same variables from the Netlify dashboard — the management token is **not** needed there.

After publishing changes in Contentful, the live site updates on the next Netlify build (trigger one manually or
set up a Contentful → Netlify build webhook).
