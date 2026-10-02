# Imagery guide

Six optional image slots are built into the site. Generate each one with your AI image tool, save it in
`static/images/` with the **exact file name** below, then restart `npm run dev`.

- **Before an image exists:** your local dev site shows a dashed, labelled placeholder in its place. The live site
  shows the current design instead, so nothing unfinished ever goes public.
- **After you add it:** it appears automatically on both. There's nothing to switch on.

The master list (with alt text) lives in [`src/data/imagery.js`](src/data/imagery.js). Edit prompts or alt text there.

## Shared style

Add this to the end of every prompt so the set matches the site's palette:

> minimal, editorial, soft natural light, neutral palette of off-white #fafaf8, warm grey #f1f0ed and near-black
> #131314 with one small terracotta #e0643c accent, lots of negative space, no text, no logos

## Slots

| File | Size | Where it appears |
|---|---|---|
| `about-workspace.jpg` | 1600 × 1200 (4:3) | Home → *Who I am*, replaces the illustration card |
| `craft-abstract.jpg` | 1200 × 1500 (4:5) | Home → *Craft*, banner at the top of the dark skill card |
| `contact-studio.jpg` | 1200 × 1500 (4:5) | Home → *Next chapter*, card behind the "Say hello" button |
| `header-portfolio.jpg` | 2400 × 1000 (12:5) | Portfolio page header banner |
| `header-tools.jpg` | 2400 × 1000 (12:5) | Tools page header banner |
| `og-image.jpg` | 1200 × 630 | Preview image when your link is shared (LinkedIn, Slack…) |

### Prompts

**about-workspace.jpg:** Top-down photo of a tidy designer's desk: laptop showing a wireframe, sketchbook with
user-journey sketches, sticky notes, a coffee cup, *+ shared style*

**craft-abstract.jpg:** Abstract 3D composition of stacked rounded cards and soft geometric shapes floating,
representing design tools and systems, dark background near-black #131314 with soft grey highlights and a single
terracotta shape, *+ shared style*

**contact-studio.jpg:** Bright, welcoming corner of a modern studio with a large window, a plant, a chair and a
small table with two coffee cups, inviting a conversation, no people, *+ shared style*
A real photo of you works even better here, since people connect with faces.

**header-portfolio.jpg:** Wide abstract banner of floating device mockups (laptop, phone, tablet) with blank screens
arranged in soft perspective on an off-white background, *+ shared style*

**header-tools.jpg:** Wide flat-lay of neatly arranged physical design tools (pencils, ruler, colour swatches,
notebook, keyboard) on a warm grey surface, *+ shared style*

**og-image.jpg:** Clean social share banner background: soft off-white gradient with a subtle near-black geometric
frame on the right and empty space on the left for a name, *+ shared style*. After generating, add "LING KAN"
on the left in Inter (any editor, e.g. Figma or Canva) before saving.

## Tips

- Export as **JPG at ~80% quality** and keep each file under ~400 KB so pages stay fast.
- Avoid AI-generated people that could be mistaken for you; use real photos for anything that represents you.
- Project and case-study images are still managed in Contentful as before; these slots are only for decorative art.
