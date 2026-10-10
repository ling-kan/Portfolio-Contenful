const fs = require('fs');
const [, , exportFile, improvementsFile, outputFile] = process.argv;

if (!exportFile || !improvementsFile || !outputFile) {
  console.error('Usage: node apply-improvements.js <export.json> <improvements.json> <output.json>');
  process.exit(1);
}

const exportData = JSON.parse(fs.readFileSync(exportFile, 'utf8'));
const improvements = JSON.parse(fs.readFileSync(improvementsFile, 'utf8'));

const byId = new Map(improvements.entries.map(e => [e.id, e.fields]));

let updated = 0;
for (const entry of exportData.entries || []) {
  const fields = byId.get(entry.sys.id);
  if (!fields) continue;
  for (const [fieldId, value] of Object.entries(fields)) {
    entry.fields[fieldId] = { 'en-US': value };
  }
  updated++;
}

fs.writeFileSync(outputFile, JSON.stringify(exportData, null, 2), 'utf8');
console.log(`Updated ${updated} entries. Wrote ${outputFile}.`);