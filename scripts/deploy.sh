# 1. Generate Schema Diff
npx contentful space environment diff \
  --space-id "$GATSBY_CONTENTFUL_SPACE_ID" \
  --source-environment-id "$CONTENTFUL_ENVIRONMENT" \
  --target-environment-id "$CONTENTFUL_PROD_ENV" \
  --cma-token "$CONTENTFUL_MANAGEMENT_TOKEN" \
  --export-file migration.js || true

# 2. Apply Schema Migration (if changes exist)
if [ -f migration.js ]; then
  npx contentful space migration \
    --space-id "$GATSBY_CONTENTFUL_SPACE_ID" \
    --environment-id "$CONTENTFUL_PROD_ENV" \
    --cma-token "$CONTENTFUL_MANAGEMENT_TOKEN" \
    migration.js
fi

# 3. Create Entry Changeset (Excluding contentfulBlogPost)
npx contentful-merge create \
  --space "$GATSBY_CONTENTFUL_SPACE_ID" \
  --source "$CONTENTFUL_ENVIRONMENT" \
  --target "$CONTENTFUL_PROD_ENV" \
  --cda-token "$GATSBY_CONTENTFUL_DELIVERY_TOKEN" \
  --exclude "contentTypes:contentfulBlogPost" \
  --output-file changeset.json

# 4. Apply Changeset to Production
npx contentful-merge apply \
  --space "$GATSBY_CONTENTFUL_SPACE_ID" \
  --environment "$CONTENTFUL_PROD_ENV" \
  --cma-token "$CONTENTFUL_MANAGEMENT_TOKEN" \
  --file changeset.json