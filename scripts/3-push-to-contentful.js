const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

const contentful = require('contentful-management');
const fs = require('fs');

// Sanity check — remove once confirmed working
console.log('Looking for .env at:', path.resolve(__dirname, '../../.env'));
console.log('Management token loaded?', !!process.env.CONTENTFUL_MANAGEMENT_TOKEN);
console.log('Space ID loaded?', !!process.env.GATSBY_CONTENTFUL_SPACE_ID);

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

// Configurable via .env, with sensible fallbacks
const SPACE_ID = process.env.GATSBY_CONTENTFUL_SPACE_ID || 'ukwr6tpgmskj';
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT_ID || 'test';
const INPUT_FILE = process.env.PUSH_INPUT_FILE || './scripts/new-contentful.json';

async function runBulkPush() {
  try {
    if (!fs.existsSync(INPUT_FILE)) {
      console.error(`❌ Input file not found: ${INPUT_FILE}`);
      process.exit(1);
    }

    console.log('📂 Reading local JSON content file...');
    const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
    const data = JSON.parse(rawData);

    console.log(`🔌 Connecting to Contentful space: ${SPACE_ID} (${ENVIRONMENT_ID})...`);
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);

    // 1. Process Assets
    const assets = data.assets || [];
    console.log(`🖼️ Processing ${assets.length} assets...`);
    for (const item of assets) {
      const assetId = item.sys.id;
      let asset;
      try {
        asset = await environment.getAsset(assetId);
        asset.fields = item.fields;
        asset = await asset.update();
        console.log(`✔ Updated existing asset: ${assetId}`);
      } catch (e) {
        asset = await environment.createAssetWithId(assetId, { fields: item.fields });
        console.log(`✔ Created new asset: ${assetId}`);
      }
      asset = await asset.processForAllLocales();
      await asset.publish();
      console.log(`🚀 Published asset: ${assetId}`);
    }

    // 2. Process Entries
    const entries = data.entries || [];
    console.log(`📝 Processing ${entries.length} entries for bulk upsert...`);
    for (const item of entries) {
      const entryId = item.sys.id;
      const contentTypeId = item.sys.contentType.sys.id;
      let entry;

      try {
        entry = await environment.getEntry(entryId);
        entry.fields = item.fields;
        entry = await entry.update();
        console.log(`✔ Updated existing entry: ${entryId}`);
      } catch (e) {
        entry = await environment.createEntryWithId(contentTypeId, entryId, {
          fields: item.fields,
        });
        console.log(`✔ Created new entry: ${entryId}`);
      }

      await entry.publish();
      console.log(`🚀 Published entry: ${entryId}`);
    }

    console.log('✨ Bulk push completed successfully! All items are now live.');
  } catch (error) {
    console.error('❌ Bulk push failed:', error.message || error);
  }
}

runBulkPush();