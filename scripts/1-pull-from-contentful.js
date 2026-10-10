const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

const contentful = require('contentful');
const fs = require('fs');

const SPACE_ID = process.env.GATSBY_CONTENTFUL_SPACE_ID;
const DELIVERY_TOKEN = process.env.GATSBY_CONTENTFUL_DELIVERY_TOKEN;
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master';

if (!SPACE_ID || !DELIVERY_TOKEN) {
  console.error('❌ Missing GATSBY_CONTENTFUL_SPACE_ID or GATSBY_CONTENTFUL_DELIVERY_TOKEN in .env');
  process.exit(1);
}

const client = contentful.createClient({
  space: SPACE_ID,
  accessToken: DELIVERY_TOKEN,
  environment: ENVIRONMENT_ID,
});

async function pullAllDataToJSON() {
  try {
    console.log(`Pulling from space ${SPACE_ID} (env: ${ENVIRONMENT_ID})...`);

    const entriesResponse = await client.getEntries({ limit: 1000 });
    const assetsResponse = await client.getAssets({ limit: 1000 });

    const exportData = {
      timestamp: new Date().toISOString(),
      totalEntries: entriesResponse.total,
      totalAssets: assetsResponse.total,
      entries: entriesResponse.items,
      assets: assetsResponse.items,
    };

    const fileName = 'bin/contentful-export.json';
    fs.writeFileSync(fileName, JSON.stringify(exportData, null, 2), 'utf8');

    console.log(`✅ Saved ${entriesResponse.total} entries and ${assetsResponse.total} assets to "${fileName}".`);
  } catch (error) {
    console.error('Error pulling data from Contentful:', error.message || error);
  }
}

pullAllDataToJSON();