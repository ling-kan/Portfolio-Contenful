# Contentful Alt Text Generator

Automatically generates alt text (accessibility descriptions) for every image asset in a Contentful space using Google's Gemini AI, then writes it back to the asset's `description` field.

Safe to re-run — it overwrites existing descriptions each time.

---

## Table of Contents

- [What It Does](#what-it-does)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Rate Limiting & Retries](#rate-limiting--retries)
- [Configuration](#configuration)
- [Important Notes](#important-notes)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [License](#license)

---

## What It Does

1. Connects to Contentful using the Management API
2. Fetches every image asset in the `master` environment
3. Downloads each image and sends it to Gemini (`gemini-3.8-flash`)
4. Asks the model for a 1–2 sentence accessibility description
5. Writes the result into the asset's `en-US` `description` field
6. Publishes the asset so the change goes live

---

## Prerequisites

- **Node.js 18+** (uses the built-in `fetch` API)
- A **Contentful account** with:
  - A Management API token (Settings → API keys → Content management tokens)
  - Your Space ID (Settings → General settings)
- A **Google AI Studio API key** with access to the Interactions API
  - Get one at <https://aistudio.google.com/apikey>
  - Free tier is limited to **5 requests per minute** — the script throttles itself and retries automatically when it hits this cap

---

## Environment Variables

The script reads from a `.env` file located **two levels above this folder**:

```
Portfolio-Contenful/
├── .env                              ← here
└── scripts/
    └── contentful-alt-generator/
        ├── generate-alt-text.js
        └── README.md
```

Your `.env` should contain:

```env
CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-xxxxxxxxxxxxxxxxxxxxx
GATSBY_CONTENTFUL_SPACE_ID=xxxxxxxxxxxx
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

> ⚠️ Never commit `.env` to git. Add it to `.gitignore`.

---

## Installation

From the project root:

```bash
cd scripts/contentful-alt-generator
npm install dotenv contentful-management
```

If you don't have a `package.json` yet:

```bash
npm init -y
npm install dotenv contentful-management
```

---

## Usage

From anywhere:

```bash
node /path/to/Portfolio-Contenful/scripts/contentful-alt-generator/generate-alt-text.js
```

Or `cd` into the folder and run:

```bash
node generate-alt-text.js
```

The script resolves `.env` relative to its own location via `__dirname`, so it works no matter where you invoke it from.

### Example output

```
Processing: Equifax registration flow (https://images.ctfassets.net/...)
⏳ Rate limited on attempt 1 for "Equifax registration flow". Waiting 36s...
✅ 34akfekhN4XKB2SyQwLLiR → "A multi-step registration form with input fields
   and a progress indicator."
Processing: Equifax registration analysis (https://images.ctfassets.net/...)
✅ 4FkljgskIaai6mZCTS2iKt → "An analytical dashboard showing registration
   funnel metrics."
```

---

## How It Works

| Step | What happens |
|------|--------------|
| **1. Fetch assets** | `environment.getAssets({ mimetype_group: 'image' })` |
| **2. Resolve URL** | Prepends `https:` to Contentful's protocol-relative URLs |
| **3. Encode image** | Downloads the image and base64-encodes it |
| **4. Call Gemini** | POSTs to `/v1beta/interactions` with `gemini-3.8-flash` |
| **5. Parse response** | Walks `steps[]` looking for a `model_output` text block |
| **6. Update asset** | Sets `fields.description['en-US']`, updates, publishes |

---

## Rate Limiting & Retries

Google's **Free Tier allows only 5 requests per minute**. The script handles this in two ways:

1. **Pre-emptive throttle** — enforces a minimum 13-second gap between successful calls (`MIN_GAP_MS`), keeping you at ~4.6 req/min.
2. **Automatic retry** — when a `too_many_requests` (429) error arrives, it reads the "retry in Ns" hint from Google's message, waits that long (+2s cushion), then retries the **same image** up to 10 times.

If you're on a paid tier and want faster execution, lower `MIN_GAP_MS` in the script (e.g. to `500`).

---

## Configuration

Tunable constants at the top of `generate-alt-text.js`:

| Constant | Default | Purpose |
|----------|---------|---------|
| `LOCALE` | `'en-US'` | Which locale the description is written to |
| `MAX_RETRIES` | `10` | Max attempts per image before giving up |
| `DEFAULT_WAIT_MS` | `35000` | Fallback wait if Google doesn't send a hint |
| `MIN_GAP_MS` | `13000` | Minimum gap between successful calls |

### Changing the AI Prompt

The prompt sent to Gemini is defined inside `generateWithRetry`:

```javascript
const aiPrompt =
  'Describe this image concisely for alt text, focusing on key visual ' +
  'elements for accessibility. Maximum 1-2 sentences.';
```

Edit this to change tone, length, or focus (e.g. ask for keyword-rich descriptions for SEO).

### Changing the Locale

By default the script writes to `en-US`. If your Contentful space uses a different default locale (e.g. `en-GB`), change the `LOCALE` constant.

---

## Important Notes

- **This overwrites existing descriptions.** There is no "skip if present" check. If some images have hand-written alt text you want to keep, back them up first (Contentful keeps version history — you can restore from Settings → Content model → Asset → Versions).
- **Alt text quality varies.** AI-generated descriptions are a starting point, not a replacement for human review on critical images.
- **This touches the `description` field only.** It does not modify `title` or any other field.
- **Publishes immediately.** Each updated asset is published, not left as a draft.

---

## Troubleshooting

### `Cannot find module 'dotenv'`

Run `npm install` in the script's folder.

### `ENOENT: no such file or directory, open '.../.env'`

Your `.env` isn't where the script expects it. Confirm the path:

```javascript
console.log(path.resolve(__dirname, '../../.env'));
```

Adjust the number of `../` if needed.

### `Gemini error: model not available`

Google frequently retires model names. Check <https://ai.google.dev/gemini-api/docs/get-started> for the current model list and update the `model` field in `generateWithRetry`.

### `403 Forbidden` from Contentful

Your Management token likely lacks permission for the space, or the Space ID is wrong. Double-check both in Contentful settings.

### `Too many requests` loops forever

Your Free Tier limit may be lower than expected, or another process is using the same API key. Wait a few minutes and re-run, or upgrade your Gemini tier.

### `MODULE_NOT_FOUND` for `index.js`

You ran `node index.js` but your file is named `generate-alt-text.js`. Run:

```bash
node generate-alt-text.js
```

---

## Project Structure

```
scripts/contentful-alt-generator/
├── generate-alt-text.js   # Main script
├── README.md              # This file
├── package.json           # Dependencies
└── node_modules/
```

---

## License

Internal use. Not published.