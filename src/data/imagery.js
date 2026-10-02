// Image slots for AI-generated artwork.
//
// To fill a slot: save the image as static/images/<file> (exact name below), then restart
// `npm run dev`. Until the file exists, development shows a labelled placeholder and the
// production site falls back to the existing design, so nothing broken ever ships.
//
// Shared style for every prompt so the set feels consistent with the site's palette.
const STYLE =
  'minimal, editorial, soft natural light, neutral palette of off-white #fafaf8, warm grey #f1f0ed and near-black #131314 with one small terracotta #e0643c accent, lots of negative space, no text, no logos'

const imagery = {
  about: {
    file: 'about-workspace.jpg',
    size: '1600 × 1200 (4:3)',
    alt: 'A calm, organised design workspace',
    prompt: `Top-down photo of a tidy designer's desk: laptop showing a wireframe, sketchbook with user-journey sketches, sticky notes, a coffee cup, ${STYLE}`,
  },
  craft: {
    file: 'craft-abstract.jpg',
    size: '1200 × 1500 (4:5)',
    alt: '',
    prompt: `Abstract 3D composition of stacked rounded cards and soft geometric shapes floating, representing design tools and systems, dark background near-black #131314 with soft grey highlights and a single terracotta shape, ${STYLE}`,
  },
  // A real photo of you works best here; this prompt is for a people-free alternative.
  contact: {
    file: 'contact-studio.jpg',
    size: '1200 × 1500 (4:5)',
    alt: 'A bright, welcoming studio space',
    prompt: `Bright, welcoming corner of a modern studio with a large window, a plant, a chair and a small table with two coffee cups, inviting a conversation, no people, ${STYLE}`,
  },
  portfolioHeader: {
    file: 'header-portfolio.jpg',
    size: '2400 × 1000 (12:5)',
    alt: '',
    prompt: `Wide abstract banner of floating device mockups (laptop, phone, tablet) with blank screens arranged in soft perspective on an off-white background, ${STYLE}`,
  },
  toolsHeader: {
    file: 'header-tools.jpg',
    size: '2400 × 1000 (12:5)',
    alt: '',
    prompt: `Wide flat-lay of neatly arranged physical design tools — pencils, ruler, colour swatches, notebook, keyboard — on a warm grey surface, ${STYLE}`,
  },
  social: {
    file: 'og-image.jpg',
    size: '1200 × 630 (social share)',
    alt: 'LING KAN — Portfolio',
    prompt: `Clean social share banner background: soft off-white gradient with a subtle near-black geometric frame on the right and empty space on the left for a name, ${STYLE}`,
  },
}

export default imagery
