#!/bin/bash
set -e

echo "=== Phase 1: Migrating Contentful Schema ==="
npx contentful space environment diff \
  --space-id "$GATSBY_CONTENTFUL_SPACE_ID" \
  --source-environment-id "$CONTENTFUL_SOURCE_ENV" \
  --target-environment-id "$CONTENTFUL_ENVIRONMENT" \
  --cma-token "$CONTENTFUL_MANAGEMENT_TOKEN" \
  --export-file migration.js || true

if [ -f migration.js ]; then
  npx contentful space migration \
    --space-id "$GATSBY_CONTENTFUL_SPACE_ID" \
    --environment-id "$CONTENTFUL_ENVIRONMENT" \
    --cma-token "$CONTENTFUL_MANAGEMENT_TOKEN" \
    migration.js
fi

echo "=== Phase 2: Merging Contentful Entries ==="
npx contentful-merge create \
  --space "$GATSBY_CONTENTFUL_SPACE_ID" \
  --source "$CONTENTFUL_SOURCE_ENV" \
  --target "$CONTENTFUL_ENVIRONMENT" \
  --cda-token "$GATSBY_CONTENTFUL_DELIVERY_TOKEN" \
  --output-file changeset.json

npx contentful-merge apply \
  --space "$GATSBY_CONTENTFUL_SPACE_ID" \
  --environment "$CONTENTFUL_ENVIRONMENT" \
  --cma-token "$CONTENTFUL_MANAGEMENT_TOKEN" \
  --file changeset.json

echo "=== Phase 3: Building Gatsby Site ==="
gatsby build