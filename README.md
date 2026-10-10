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
│   ├── contentful-blog-improver/
│   │   ├── improve-blogposts.js      ← Workflow D
│   │   └── package.json
│   │
│   ├── 1-pull-from-contentful.js     ← Workflow B, step 1
│   ├── 2-apply-improvements.js       ← Workflow B, step 2
│   ├── 3-push-to-contentful.js       ← Workflow B, step 3
│   ├── 4-deploy-to-production.sh     ← Workflow C
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
# Root dependencies
npm install

# Pipeline scripts are self-contained; install each one
cd scripts/contentful-alt-generator && npm install && cd ../..
cd scripts/contentful-blog-improver && npm install && cd ../..
```

`4-deploy-to-production.sh` uses `npx` for all its commands, so no global installs are required — but the first run will download the CLI tools.

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
GATSBY_CONTENTFUL_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GATSBY_CONTENTFUL_DELIVERY_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ─── Write (Management API) - Personal access token (Settings) ─────────────────────
CONTENTFUL_MANAGEMENT_TOKEN=xxxxxxxxxxxxxxxxxxxxx


# ─── Push target file ───────────────────────────
PUSH_INPUT_FILE=./scripts/updated.json

# ─── AI (Workflows A and D) ─────────────────────
GATSBY_GOOGLE_ANALYTICS_TRACKING_ID=xxxxxxxxxxxxxxxxx
GATSBY_GOOGLE_TAG_MANAGER_ID=xxxxxxxxxxxxxxxxxxxxx
GATSBY_PORTFOLIO_ACCESS_PASS=xxxxxxxxxxxxxxxxxxxxx
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
| `contentful-blog-improver/improve-blogposts.js` | AI-generated | Gemini + Contentful → Contentful | Rewrite every blog post as a portfolio case study |
| `1-pull-from-contentful.js` | — | Contentful → local JSON | Export every published entry + asset |
| `2-apply-improvements.js` | Local file | local JSON → local JSON | Merge hand-authored field changes |
| `3-push-to-contentful.js` | Local file | local JSON → Contentful | Upsert + publish entries and assets |
| `4-deploy-to-production.sh` | Contentful `test` | Contentful → Contentful | Diff + promote `test` → `master` |

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
```

### What gets promoted

- **Schema** — content types, fields, validators, editor settings
- **Entries** — all content types **except `contentfulBlogPost`**
- **Assets** — all image and document assets

### What gets skipped

- **Blog posts** — excluded via `--exclude "contentTypes:contentfulBlogPost"` in Step 3. Remove that line if you want them promoted.

### Important notes

- **Writes directly to production.** No dry-run.
- **Schema migrations are the risky part.** Adding a required field can break entries before Step 4 fills them in. Safe order: add optional → push content → make required.
- **`contentful-merge` is a community tool.** Reliable, but handling of rich text and references sometimes differs from expectations.
- **Version history is your rollback** for individual entries.

---

## Workflow D — AI Blog Post Improver

Reads every `blogPost` entry, analyses its images with Gemini, and rewrites `title`, `summary` and `content` as full portfolio case studies. Tags each processed post with `ai-improved` so re-runs skip it.

**Script:** `contentful-blog-improver/improve-blogposts.js`
**Change origin:** AI-generated on the fly
**Direction:** Gemini + Contentful → Contentful

### What it does

1. Fetches every entry of content type `blogPost`
2. Extracts existing copy: title, summary, description, role, tags, dates, content
3. Finds every image referenced — hero image plus all `![alt](url)` markdown images in `content`
4. Sends each image to Gemini for structured analysis (type, summary, portfolio purpose)
5. Sends existing copy + image analyses to Gemini with a detailed portfolio-writing brief
6. Writes back improved `title`, `summary` and `content`
7. Adds the `ai-improved` tag

The generated content follows a fixed structure: **Project overview → What this proves → The challenge → My process → What I did → Why I made these decisions → Images in context → Impact → Tools and skills applied → Roles performed**.

### Usage

```bash
npm run improve
```

### Example output

```
Fetching all entries of type "blogPost"...
Found 15 blog posts.

──────────────────────────────────────────────
📝 Processing: MyEquifax Registration Flow Optimisation
   id: 26zZqUDJzOXHsyrIBGEuiK
   Found 4 image reference(s).
   ✔ Analysed Registration equifax device image
   ✔ Analysed myEquifax - Registration Analysis
   ✔ Analysed Registration Flow - Improvements
   ✔ Analysed myEquifax - Registration Before & After
✅ Updated 26zZqUDJzOXHsyrIBGEuiK
   title: MyEquifax Registration Flow Optimisation
```

### Configuration

| Constant | Default | Purpose |
|----------|---------|---------|
| `LOCALE` | `'en-US'` | Which locale the fields are written to |
| `CONTENT_TYPE` | `'blogPost'` | Which content type to process |
| `MAX_RETRIES` | `10` | Max attempts per Gemini call |
| `DEFAULT_WAIT_MS` | `35000` | Fallback wait if Google doesn't send a hint |
| `MIN_GAP_BETWEEN_CALLS_MS` | `13000` | Minimum gap between calls |
| `SKIP_IF_IMPROVED` | `true` | Skip posts already tagged `ai-improved` |
| `IMPROVED_TAG` | `'ai-improved'` | Marker tag added to processed posts |
| `GEMINI_MODEL` | `'gemini-3.8-flash'` | Which Gemini model to use |

### Expected runtime

A full 15-post run makes roughly 90 Gemini calls. At the enforced 13-second gap this takes **~20–25 minutes**. Re-runs are near-instant because completed posts are skipped.

### Important notes

- **Overwrites existing title, summary and content.** There is no per-field merge.
- **Idempotent.** Posts tagged `ai-improved` are skipped on re-runs.
- **Publishes immediately.**
- **To regenerate one post:** remove the `ai-improved` tag in Contentful and re-run.
- **To regenerate everything:** set `SKIP_IF_IMPROVED = false` for one run, then set it back.

---

## Which Workflow Should I Use?

| If your changes live... | Use |
|------------------------|-----|
| In the Contentful web UI (on `test`) | **Workflow C** |
| In a local `improvements.json` file | **Workflow B** |
| Nowhere yet — you want AI to generate alt text | **Workflow A** |
| Nowhere yet — you want AI to rewrite blog posts | **Workflow D** |
| You need to add or change content types (schema) | **Workflow C** |
| You want to review an exact diff before pushing | **Workflow B** |
| You just want every image to have alt text | **Workflow A** |
| You just want every blog post rewritten | **Workflow D** |

### Combining workflows

A typical full cycle:

1. `npm run alt:generate` — bulk alt text
2. `npm run improve` — AI rewrite all blog posts
3. `npm run pull` → edit `improvements.json` → `npm run apply` — surgical fixes
4. `npm run push:test` — stage in `test`
5. Verify in Contentful UI
6. `npm run deploy:prod` — promote to production

---

## Quick Reference Card

```bash
# ── One-time setup ─────────────────────────────
npm install
cd scripts/contentful-alt-generator && npm install && cd ../..
cd scripts/contentful-blog-improver && npm install && cd ../..
npm run doctor

# ── Workflow A — bulk AI alt text ──────────────
npm run alt:generate

# ── Workflow D — AI blog post rewrite ──────────
npm run improve

# ── Workflow B — local edits ───────────────────
npm run pull                       # → contentful-export.json
# (hand-edit improvements.json)
npm run apply                      # → updated.json
npm run push:test                  # → Contentful test
# (verify in Contentful UI)
npm run push:prod                  # → Contentful master

# ── Workflow C — Contentful-to-Contentful ──────
npm run deploy:prod

# ── Composite ──────────────────────────────────
npm run pipeline:full-local        # pull → apply → push:test
npm run pipeline:promote           # push:test → deploy:prod

# ── Housekeeping ───────────────────────────────
npm run doctor                     # verify .env
npm run clean:dry                  # preview pipeline cleanup
npm run clean:pipeline             # delete generated JSON files
```

---

## File Reference

### `contentful-alt-generator/generate-alt-text.js`
Bulk-generates `title` and `description` for every image asset using Gemini.

| Env var | Required | Purpose |
|---------|----------|---------|
| `GATSBY_CONTENTFUL_SPACE_ID` | ✅ | Which space to scan |
| `CONTENTFUL_ENVIRONMENT_ID` | ❌ | Defaults to `master` |
| `CONTENTFUL_MANAGEMENT_TOKEN` | ✅ | Read + write access |
| `GEMINI_API_KEY` | ✅ | Google AI Studio key |

### `contentful-blog-improver/improve-blogposts.js`
Rewrites `title`, `summary` and `content` of every `blogPost` entry, with image analysis.

| Env var | Required | Purpose |
|---------|----------|---------|
| `GATSBY_CONTENTFUL_SPACE_ID` | ✅ | Which space to scan |
| `CONTENTFUL_ENVIRONMENT_ID` | ❌ | Defaults to `master` |
| `CONTENTFUL_MANAGEMENT_TOKEN` | ✅ | Read + write access |
| `GEMINI_API_KEY` | ✅ | Google AI Studio key |

### `1-pull-from-contentful.js`
Exports every published entry and asset to `contentful-export.json`.

| Env var | Required | Purpose |
|---------|----------|---------|
| `GATSBY_CONTENTFUL_SPACE_ID` | ✅ | Which space to pull from |
| `GATSBY_CONTENTFUL_DELIVERY_TOKEN` | ✅ | Read access |

### `2-apply-improvements.js`
Merges field values from `improvements.json` into the export. Pure file I/O — no API calls.

```bash
node scripts/2-apply-improvements.js <export.json> <improvements.json> <output.json>
```

Locale is hardcoded to `en-US`. Change the string if your space uses a different default.

### `3-push-to-contentful.js`
Upserts and publishes every asset and entry from a JSON file into a target environment.

| Env var | Required | Default | Purpose |
|---------|----------|---------|---------|
| `GATSBY_CONTENTFUL_SPACE_ID` | ✅ | — | Target space |
| `CONTENTFUL_MANAGEMENT_TOKEN` | ✅ | — | Write access |
| `CONTENTFUL_ENVIRONMENT_ID` | ❌ | `test` | Target environment |
| `PUSH_INPUT_FILE` | ❌ | `./scripts/new-contentful.json` | JSON to push |

### `4-deploy-to-production.sh`
Promotes content and schema from `$CONTENTFUL_ENVIRONMENT_ID` to `$CONTENTFUL_PROD_ENV` using Contentful's CLI tooling. Excludes blog posts.

| Env var | Required | Purpose |
|---------|----------|---------|
| `GATSBY_CONTENTFUL_SPACE_ID` | ✅ | Space to operate on |
| `GATSBY_CONTENTFUL_DELIVERY_TOKEN` | ✅ | Read access for diffing |
| `CONTENTFUL_MANAGEMENT_TOKEN` | ✅ | Write access |
| `CONTENTFUL_ENVIRONMENT_ID` | ✅ | Source env |
| `CONTENTFUL_PROD_ENV` | ✅ | Target env |

---

## Token Types Cheat Sheet

| Script | Token(s) | Env var | Prefix |
|--------|----------|---------|--------|
| `generate-alt-text.js` | Management + Gemini | `CONTENTFUL_MANAGEMENT_TOKEN`, `GEMINI_API_KEY` | `CFPAT-`, `AIza...` |
| `improve-blogposts.js` | Management + Gemini | `CONTENTFUL_MANAGEMENT_TOKEN`, `GEMINI_API_KEY` | `CFPAT-`, `AIza...` |
| `1-pull-from-contentful.js` | Delivery | `GATSBY_CONTENTFUL_DELIVERY_TOKEN` | *(none)* |
| `2-apply-improvements.js` | *(none — file I/O)* | — | — |
| `3-push-to-contentful.js` | Management | `CONTENTFUL_MANAGEMENT_TOKEN` | `CFPAT-` |
| `4-deploy-to-production.sh` | Both | `GATSBY_CONTENTFUL_DELIVERY_TOKEN` + `CONTENTFUL_MANAGEMENT_TOKEN` | both |

---

## Site Scripts (Gatsby & Netlify)

| Command | Does |
|---------|------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build to `public/` |
| `npm run serve` | Serve the built site |
| `npm run clean` | Remove Gatsby cache and `node_modules` |
| `npm run setup` | Run project setup |
| `npm run contentful-removal` | Delete `.cache` and `public` |
| `npm run netlify:login` | Authenticate with Netlify |
| `npm run netlify:deploy` | Deploy to Netlify (draft) |

> ⚠️ **`npm run clean` also deletes `node_modules`.** That triggers a full reinstall on the next `npm install`. If you only want to clear the Gatsby cache, run `npx gatsby clean` instead.

---

## Important Notes

- **Workflow B edits files locally; Workflow C edits Contentful directly.** Know which one you're running.
- **The AI scripts overwrite existing content.** Default behaviour is to skip completed items; force flags override that.
- **Export only includes published content.** Drafts are invisible to the Delivery API.
- **No pagination in the export script.** Contentful caps at 1000 items per request. If you exceed that, add pagination to `1-pull-from-contentful.js`.
- **`2-apply-improvements.js` overwrites unconditionally.** Listed fields are replaced, no merge.
- **`3-push-to-contentful.js` publishes on every run.** No dry-run mode.
- **`4-deploy-to-production.sh` writes directly to production.** No dry-run. Schema changes are applied before content.
- **The `test` environment is your safety net.** Never push straight to `master` on the first run of a new improvement set.
- **Content types must already exist in the target environment** before pushing entries of that type.

---

## Troubleshooting

### `Cannot find module 'dotenv' / 'contentful' / 'contentful-management'`
Run `npm install` at the project root, and inside each of the two script subfolders (`contentful-alt-generator`, `contentful-blog-improver`).

### `ENOENT: no such file or directory, open '.../.env'`
The script couldn't find `.env` two levels up from its own location. Check:

```bash
node -e "console.log(require('path').resolve('scripts/../../.env'))"
```

The path should resolve to your project root `.env`.

### `npm run doctor` reports a variable as missing
`.env` isn't at the project root, or the variable name is misspelled. Compare against `.env.example`.

### `403 Forbidden` from Contentful
- Wrong token type (Delivery vs Management)
- Token belongs to a different space
- Typo in `GATSBY_CONTENTFUL_SPACE_ID`
- Token was revoked in Contentful

### `Gemini error: model not available`
Google periodically retires model names. Check <https://ai.google.dev/gemini-api/docs/get-started> for the current list and update `GEMINI_MODEL`.

### `Too many requests` loops forever
Your Free Tier limit may be lower than expected, or another process is using the same API key. Wait a few minutes, or upgrade your Gemini tier.

### Export has fewer items than expected
You have more than 1000 entries or assets. Add pagination to `1-pull-from-contentful.js`.

### `3-push-to-contentful.js` fails with `createEntryWithId` error
The content type doesn't exist in the target environment. Create it there first.

### `2-apply-improvements.js` says `Updated 0 entries`
The IDs in `improvements.json` don't match any `entry.sys.id` in the export.

### `4-deploy-to-production.sh` fails at Step 1
Check `GATSBY_CONTENTFUL_SPACE_ID` is correct and both environments exist.

### `4-deploy-to-production.sh` Step 3 fails with `contentful-merge: command not found`
`npx` should download it automatically. If not:

```bash
npm install -g contentful-merge
```

### `4-deploy-to-production.sh` migration breaks entries
Adding a required field before content has been pushed is the classic failure mode. Safe order:

1. Add the field as optional
2. Push content that populates it
3. Change it to required in a follow-up migration

### `npm run clean` wiped `node_modules`
That's the current behaviour. Run `npm install` to reinstall. If you don't want this, edit `package.json` and change the `clean` script to just `gatsby clean`.

---

## Security

- **Never hardcode tokens** in scripts. Always read from `.env`.
- **`.env` is in `.gitignore`** — keep it that way.
- **If a token is ever committed**, treat it as compromised and revoke it immediately in Contentful → Settings → API keys.
- **Management tokens have full write access** to your space. Treat them like passwords.
- **Delivery tokens are technically public** (used in the browser build), but keep them out of version control anyway.
- **Gemini keys are account-scoped.** Anyone with the key can burn through your quota.
- **The `test` environment is not a security boundary.** It's a staging area, not a sandbox with different credentials.

---

## License

Internal use. Not published.