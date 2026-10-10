const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

const contentful = require('contentful');
const fs = require('fs');

// Sanity check — remove once confirmed working
console.log('Looking for .env at:', path.resolve(__dirname, '../../.env'));
console.log('Space loaded?', !!process.env.GATSBY_CONTENTFUL_SPACE_ID);
console.log('Access token loaded?', !!process.env.GATSBY_CONTENTFUL_DELIVERY_TOKEN);

const client = contentful.createClient({
  space: process.env.GATSBY_CONTENTFUL_SPACE_ID,
  accessToken: process.env.GATSBY_CONTENTFUL_DELIVERY_TOKEN,
});

async function pullAllDataToJSON() {
  try {
    console.log('Fetching all entries and assets from Contentful...');

    // Fetch all entries (paginated if you have more than 1000 items)
    const entriesResponse = await client.getEntries({ limit: 1000 });

    // Fetch all assets (images, documents)
    const assetsResponse = await client.getAssets({ limit: 1000 });

    const exportData = {
      timestamp: new Date().toISOString(),
      totalEntries: entriesResponse.total,
      totalAssets: assetsResponse.total,
      entries: entriesResponse.items,
      assets: assetsResponse.items,
    };

    // Write data to a local JSON file
    const fileName = 'contentful-export.json';
    fs.writeFileSync(fileName, JSON.stringify(exportData, null, 2), 'utf8');

    console.log(`Success! All data pulled and saved locally to "${fileName}".`);
  } catch (error) {
    console.error('Error pulling data from Contentful:', error);
  }
}

pullAllDataToJSON();