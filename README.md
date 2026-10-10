# Portfolio — Contentful & Gatsby

A Gatsby-powered portfolio site with a fully scripted Contentful content pipeline. Bulk-generate AI alt text, rewrite blog posts as portfolio case studies with AI, export and hand-edit content locally, and promote entire environments between Contentful stages.

The repository is split into two concerns:

- **The site** — a Gatsby front end that reads from the Contentful Delivery API at build time.
- **The pipeline** — a set of Node.js and shell scripts that let you work with Contentful content programmatically, without touching the web UI unless you choose to.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [All Scripts at a Glance](#all-scripts-at-a-glance)
- [Where Changes Live — At a Glance](#where-changes-live--at-a-glance)
- [npm Script Reference](#npm-script-reference)
- [Workflow A — AI Alt Text Generator](#workflow-a--ai-alt-text-generator)
- [Workflow B — JSON Pipeline (Local Edits)](#workflow-b--json-pipeline-local-edits)
- [Workflow C — Contentful-to-Contentful Promotion](#workflow-c--contentful-to-contentful-promotion)
- [Workflow D — AI Blog Post Improver](#workflow-d--ai-blog-post-improver)
- [Which Workflow Should I Use?](#which-workflow-should-i-use)
- [Quick Reference Card](#quick-reference-card)
- [File Reference](#file-reference)
- [Token Types Cheat Sheet](#token-types-cheat-sheet)
- [Site Scripts (Gatsby & Netlify)](#site-scripts-gatsby--netlify)
- [Important Notes](#important-notes)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [License](#license)

---

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url>
cd Portfolio-Contenful
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — see Environment Variables section

# 3. Verify your .env is loaded
npm run doctor

# 4. Run the site
npm run dev

# 5. Optional — run the AI pipelines
npm run alt:generate     # bulk alt text on all images
npm run improve          # AI rewrite all blog posts
```

---

## Project Structure

```
Portfolio-Contenful/
├── .env                              ← your secrets (gitignored)
├── .env.example                      ← template (committed)
├── .gitignore
├── package.json
├── README.md                         ← this file
├── gatsby-config.js
├── gatsby-node.js
├── src/                              ← Gatsby site source
│   ├── components/
│   ├── pages/
│   ├── templates/
│   └── styles/
│
├── bin/
│   ├── hello.js
│   └── setup.js
│
├── scripts/
│   ├── contentful-alt-generator/
│   │   ├── generate-alt-text.js      ← Workflow A
│   │   └── package.json
│   │
│   ├── 1-pull-from-contentful.js     ← Workflow B, step 1
│   ├── 2-improve-blogposts.js        ← Workflow D
│   ├── 3-apply-improvements.js       ← Workflow B, step 2
│   ├── 4-push-to-contentful.js       ← Workflow B, step 3
│   ├── 5-deploy-to-production.sh     ← Workflow C
│   └── README.md                     ← pipeline-specific docs
│
├── contentful-export.json            ← output of pull (gitignored)
├── improvements.json                 ← your local edits (gitignored)
└── updated.json                      ← output of apply (gitignored)
```

---

## Prerequisites

- **Node.js 18+** — the pipeline scripts use the built-in `fetch` API
- **npm** (bundled with Node)
- **A Contentful account** with:
  - A **Content Delivery API** token (read access)
  - A **Content Management API** token (write access)
  - Your **Space ID**
  - A **test environment** created (see below)
- **A Google AI Studio API key** — only required for the AI workflows
  - Get one at <https://aistudio.google.com/apikey>
  - Free tier is limited to **5 requests per minute**; the AI scripts throttle and retry automatically

### Creating a test environment in Contentful

If you don't have one already:

1. Contentful → **Settings** → **Environments**
2. Click **Add environment**
3. Name it `test`, base it on `master`
4. Wait a minute for the clone to finish

The `test` environment is your safety net — nothing you do in it touches production.

---

## Installation

From the project root:

```bash
# Root dependencies — used by every script
npm install

# Alt-text generator is self-contained; install its deps
cd scripts/contentful-alt-generator && npm install && cd ../..
```

`5-deploy-to-production.sh` uses `npx` for all its commands, so no global installs are required — but the first run will download the CLI tools.

---

## Environment Variables

All pipeline scripts read from a single `.env` file at the project root.

```env
# ─── Shared ─────────────────────────────────────
GATSBY_CONTENTFUL_SPACE_ID=xxxxx
CONTENTFUL_ENVIRONMENT_ID=xxxxx
CONTENTFUL_PROD_ENV=xxxxx
NODE_NO_WARNINGS=1
NODE_VERSION=20

# ─── Read (Delivery API) ────────────────────────
GATSBY_CONTENTFUL_DELIVERY_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GATSBY_CONTENTFUL_PREVIEW_TOKEN=xxxxxxxxxxx

# ─── Write (Management API) — Personal access token ────
CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-xxxxxxxxxxxxxxxxxxxxx

# ─── Push target file ───────────────────────────
PUSH_INPUT_FILE=./scripts/updated.json

# ─── Site ───────────────────────────────────────
GATSBY_GOOGLE_ANALYTICS_TRACKING_ID=xxxxxxxxxxxxxxxxx
GATSBY_GOOGLE_TAG_MANAGER_ID=xxxxxxxxxxxxxxxxxxxxx
GATSBY_PORTFOLIO_ACCESS_PASS=xxxxxxxxxxxxxxxxxxxxx

# ─── AI (Workflows A and D) ─────────────────────
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

> ⚠️ **Never commit `.env` to git.** It's already in `.gitignore`.

### Where to find each token

| Token | Contentful Location | Prefix |
|-------|---------------------|--------|
| Delivery | Settings → API keys → *Content Delivery API - access token* | *(none)* |
| Management | Settings → API keys → *Content management tokens* | `CFPAT-` |
| Gemini | <https://aistudio.google.com/apikey> | `AIza...` |

Contentful tokens are **not interchangeable**. Passing a Management token to the Delivery API (or vice versa) returns a `403`.

### The `GATSBY_` prefix

Gatsby exposes environment variables prefixed with `GATSBY_` to the browser build. The pipeline reuses the same tokens via these aliases so you don't need to maintain two copies.

### Verify your setup

```bash
npm run doctor
```

Expected output:

```
GATSBY_CONTENTFUL_SPACE_ID: ✅ set
CONTENTFUL_MANAGEMENT_TOKEN: ✅ set
GATSBY_CONTENTFUL_DELIVERY_TOKEN: ✅ set
```

---

## All Scripts at a Glance

| Script | Change origin | Direction | Purpose |
|--------|--------------|-----------|---------|
| `contentful-alt-generator/generate-alt-text.js` | AI-generated | Gemini + Contentful → Contentful | Bulk alt text for every image |
| `2-improve-blogposts.js` | AI-generated | Gemini + Contentful → Contentful | Rewrite every blog post as a portfolio case study |
| `1-pull-from-contentful.js` | — | Contentful → local JSON | Export every published entry + asset |
| `3-apply-improvements.js` | Local file | local JSON → local JSON | Merge hand-authored field changes |
| `4-push-to-contentful.js` | Local file | local JSON → Contentful | Upsert + publish entries and assets |
| `5-deploy-to-production.sh` | Contentful `test` | Contentful → Contentful | Diff + promote `test` → `master` |

---

## Where Changes Live — At a Glance

| Workflow | Where you author changes | Where the source data lives | Pushes to |
|----------|--------------------------|----------------------------|-----------|
| **A — Alt text generator** | Nowhere — AI generates on the fly | Contentful + Gemini API | Contentful `master` |
| **B — JSON pipeline** | **Locally**, in `improvements.json` | Local disk, then pushed up | Contentful `test`, then `master` |
| **C — Deploy script** | **Inside Contentful**, in the `test` env | Contentful `test` env | Contentful `master` env |
| **D — Blog improver** | Nowhere — AI generates on the fly | Contentful `blogPost` + Gemini API | Contentful `master` |

```
Workflow A:
  [Gemini AI] ──► [Contentful master]      (AI writes directly to Contentful)

Workflow B:
  [Contentful] ──► [local JSON] ──► [edits] ──► [Contentful test] ──► [Contentful master]
                   (pull)            (you)      (push)                (push)

Workflow C:
  [Contentful test] ──► [diff] ──► [Contentful master]
    (you edited here
     via Contentful UI)

Workflow D:
  [Contentful blogPost + images] ──► [Gemini AI] ──► [Contentful master]
                                       (analysis + rewrite)
```

**Key distinction:**
- Workflow B = **local edits**, pushed up to Contentful
- Workflow C = **Contentful edits**, promoted within Contentful (no local file involved)
- Workflows A and D = **AI-generated**, written straight to Contentful

---

## npm Script Reference

### Site — Gatsby & Netlify

| Command | Does |
|---------|------|
| `npm run dev` | Start the Gatsby development server |
| `npm run build` | Build the production site |
| `npm run serve` | Serve the built site locally |
| `npm run clean` | Remove Gatsby cache and `node_modules` |
| `npm run prebuild` | Clean adapter binaries before build |
| `npm run heroku-postbuild` | Heroku build hook |
| `npm run postinstall` | Runs `bin/hello.js` after `npm install` |
| `npm run setup` | Runs the project setup script |
| `npm run contentful-removal` | Delete `.cache` and `public` |
| `npm run netlify:login` | Authenticate with Netlify |
| `npm run netlify:deploy` | Deploy `public/` to Netlify |

### Workflow A — AI Alt Text

| Command | Does |
|---------|------|
| `npm run alt` / `npm run alt:generate` | Bulk-generate alt text for every image |
| `npm run alt:generate:dry` | Preview only — no Contentful writes |
| `npm run alt:force` | Regenerate every image regardless |

### Workflow B — JSON Pipeline

| Command | Does |
|---------|------|
| `npm run pull` | Contentful → `contentful-export.json` |
| `npm run apply` | Merge `improvements.json` → `updated.json` |
| `npm run push` | Push `updated.json` to `CONTENTFUL_ENVIRONMENT_ID` |
| `npm run push:test` | Push to `test` |
| `npm run push:prod` | Push to `master` |

### Workflow C — Environment Promotion

| Command | Does |
|---------|------|
| `npm run deploy:prod` | Diff `test` → `master`, apply. Blog posts excluded. |

### Workflow D — AI Blog Post Improver

| Command | Does |
|---------|------|
| `npm run improve` / `npm run blog:improve` / `npm run improve-blogposts` | Rewrite all unprocessed blog posts |
| `npm run blog:improve:dry` | Preview only |
| `npm run blog:improve:force` | Rewrite even already-processed posts |

### Composite Pipelines

| Command | Runs |
|---------|------|
| `npm run pipeline:pull-apply` | `pull` → `apply` |
| `npm run pipeline:full-local` | `pull` → `apply` → `push:test` |
| `npm run pipeline:promote` | `push:test` → `deploy:prod` |

### Housekeeping

| Command | Does |
|---------|------|
| `npm run doctor` | Verify `.env` has all required variables |
| `npm run clean:dry` | List the files `clean:pipeline` would delete |
| `npm run clean:pipeline` | Delete generated pipeline JSON files |
| `npm run clean:log` | Delete logs |
| `npm run audit` | `npm audit` on production deps |

---

## Workflow A — AI Alt Text Generator

Bulk-generates `title` and `description` for every image asset using Google's Gemini AI and writes them back to Contentful.

**Script:** `contentful-alt-generator/generate-alt-text.js`
**Change origin:** AI-generated on the fly
**Direction:** Gemini + Contentful → Contentful

### What it does

1. Connects to Contentful using the Management API
2. Fetches every image asset in the target environment
3. Downloads each image and sends it to Gemini
4. Asks for a short descriptive title and a 1–2 sentence accessibility description
5. Writes the result into the asset's `en-US` `title` and `description`
6. Publishes the asset

Safe to re-run — the script skips assets where both fields are already populated.

### Usage

```bash
npm run alt:generate
# runs: node scripts/contentful-alt-generator/generate-alt-text.js
```

### Example output

```
Processing: Equifax registration flow (https://images.ctfassets.net/...)
⏳ Rate limited on attempt 1 for "Equifax registration flow". Waiting 36s...
✅ 34akfekhN4XKB2SyQwLLiR
   title:       "Equifax Registration Flow Overview"
   description: "A multi-step registration form with input fields and a progress indicator."
⏭️  Skipping 4FkljgskIaai6mZCTS2iKt: title and description already present.
```

### Configuration

Tunable constants at the top of the script:

| Constant | Default | Purpose |
|----------|---------|---------|
| `LOCALE` | `'en-US'` | Which locale the fields are written to |
| `MAX_RETRIES` | `10` | Max attempts per image before giving up |
| `DEFAULT_WAIT_MS` | `35000` | Fallback wait if Google doesn't send a hint |
| `MIN_GAP_MS` | `13000` | Minimum gap between successful calls |
| `SKIP_IF_COMPLETE` | `true` | Skip assets that already have a title and description |
| `FORCE_REGENERATE` | `false` | Set true to regenerate every asset regardless |

### Rate limiting

Google's Free Tier allows 5 requests per minute. The script:

1. Enforces a minimum 13-second gap between successful calls (~4.6 req/min).
2. Parses Google's "retry in Ns" hint on 429 responses and waits accordingly.
3. Retries up to 10 times per image.

On a paid tier you can lower `MIN_GAP_MS` (e.g. to `500`).

### Important notes

- Overwrites existing fields when regenerating — the default skip behaviour protects completed assets.
- AI-generated descriptions are a starting point, not a replacement for human review on critical images.
- Publishes immediately.

---

## Workflow B — JSON Pipeline (Local Edits)

**Use this when your changes originate on your local machine** — hand-writing alt text, correcting a typo, adding SEO metadata to specific entries.

### The flow

```
┌─────────────────────────┐
│  Contentful (source)    │
│  Delivery API (read)    │
└───────────┬─────────────┘
            │  npm run pull
            ▼
┌─────────────────────────┐
│  contentful-export.json │
└───────────┬─────────────┘
            │  npm run apply  ◄──── improvements.json
            ▼                       (you edit locally)
┌─────────────────────────┐
│  updated.json           │
└───────────┬─────────────┘
            │  npm run push:test
            ▼
┌─────────────────────────┐
│  Contentful (test)      │
│  Management API (write) │
└─────────────────────────┘
```

### Step 1 — Pull from Contentful

```bash
npm run pull
# runs: node scripts/1-pull-from-contentful.js
```

**Output:** `contentful-export.json` at the project root.

Every **published** entry and asset. Drafts are not included (the Delivery API doesn't expose them).

### Step 2 — Write your improvements

Create `improvements.json` at the project root:

```json
{
  "entries": [
    {
      "id": "4CGygcRI2qb5Pownx2Ins",
      "fields": {
        "title": "New title here",
        "description": "New alt text or description"
      }
    },
    {
      "id": "34akfekhN4XKB2SyQwLLiR",
      "fields": {
        "description": "Another updated description"
      }
    }
  ]
}
```

**Rules:**
- `id` must be the exact Contentful entry ID
- Only include fields you want to **overwrite**
- Field names must match the content type's field IDs exactly
- Values get wrapped in `{ "en-US": value }` automatically

> 💡 Find entry IDs by searching `contentful-export.json` for a title — the `sys.id` right above it is what you want.

### Step 3 — Apply improvements

```bash
npm run apply
# runs: node scripts/3-apply-improvements.js contentful-export.json improvements.json updated.json
```

**Output:** `updated.json` — the export with your changes merged in.

Sanity check:
```bash
grep -A 20 "4CGygcRI2qb5Pownx2Ins" updated.json
```

This step is pure file I/O — no Contentful calls.

### Step 4 — Push to test

```bash
npm run push:test
# runs: node scripts/4-push-to-contentful.js
```

Upserts and publishes every asset and entry from `updated.json` into the `test` environment. Nothing touches `master`.

### Step 5 — Verify, then push to production

Open Contentful, switch to the `test` environment, check the entries you changed.

If everything looks right:

```bash
npm run push:prod
```

**Now it's live.** Contentful keeps version history on every entry, so any individual change can be rolled back from the UI.

---

## Workflow C — Contentful-to-Contentful Promotion

**Use this when your changes already exist inside Contentful** — specifically in the `test` environment. This is the workflow for promoting content you edited via the Contentful web UI (or staged via Workflow B) up to production.

> 🔑 **This script does not read from your local filesystem.** The source of truth is Contentful `test`.

### What it does

| Step | Command | Compares | Writes |
|------|---------|----------|--------|
| 1 | `contentful space environment diff` | `test` schema vs `master` schema | `migration.js` (local temp) |
| 2 | `contentful space migration` | — | `master` schema |
| 3 | `contentful-merge create` | `test` entries/assets vs `master` | `changeset.json` (local temp) |
| 4 | `contentful-merge apply` | — | `master` entries/assets |

Every input comes from Contentful. Every output (except temp files) goes to Contentful.

### Usage

```bash
npm run deploy:prod
# runs: bash scripts/5-deploy-to-production.sh
```
