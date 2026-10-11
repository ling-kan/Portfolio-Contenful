#!/usr/bin/env bash
# bash scripts/4-1-test-to-prod-contentful.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../.env"

# ─── Sanity check env vars ─────────────────────────────────────
REQUIRED=(GATSBY_CONTENTFUL_SPACE_ID CONTENTFUL_PROD_ENV CONTENTFUL_ENVIRONMENT_ID CONTENTFUL_MANAGEMENT_TOKEN)
for VAR in "${REQUIRED[@]}"; do
  if [ -z "${!VAR:-}" ]; then
    echo "❌ Missing required env var: $VAR"
    exit 1
  fi
done

# ─── Show context ──────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════"
echo "  Contentful Environment Sync"
echo "══════════════════════════════════════════════"
echo ""
echo "  Space:  $GATSBY_CONTENTFUL_SPACE_ID"
echo "  Source: $CONTENTFUL_PROD_ENV"
echo "  Target: $CONTENTFUL_ENVIRONMENT_ID"
echo ""
echo "══════════════════════════════════════════════"
echo "  What do you want to do?"
echo "══════════════════════════════════════════════"
echo ""
echo "  1) MERGE  — Add/update master content into test."
echo "              Keeps anything that exists only in test."
echo "              Slower (10–60 min). Non-destructive."
echo ""
echo "  2) CLONE  — Delete test, recreate it as an exact copy of master."
echo "              Migrates schema + content + assets."
echo "              Fast (under 1 min). Destructive."
echo ""
echo "  3) Cancel"
echo ""

read -p "Choose [1/2/3]: " CHOICE

case "$CHOICE" in
  1) MODE="merge" ;;
  2) MODE="clone" ;;
  3|"") echo "Aborted."; exit 0 ;;
  *) echo "Invalid choice. Aborted."; exit 1 ;;
esac

echo ""

# ─── Confirm ───────────────────────────────────────────────────
if [ "$MODE" = "clone" ]; then
  echo "⚠️  CLONE MODE — this will PERMANENTLY DELETE '$CONTENTFUL_ENVIRONMENT_ID'"
  echo "    and recreate it as a copy of '$CONTENTFUL_PROD_ENV'."
  echo ""
  echo "    Everything unique to '$CONTENTFUL_ENVIRONMENT_ID' will be lost."
  echo ""
  read -p "Type the environment name to confirm: " ENV_CONFIRM
  if [ "$ENV_CONFIRM" != "$CONTENTFUL_ENVIRONMENT_ID" ]; then
    echo "❌ Name didn't match. Aborted."
    exit 1
  fi
else
  echo "ℹ️  MERGE MODE — '$CONTENTFUL_PROD_ENV' content will be added/updated in '$CONTENTFUL_ENVIRONMENT_ID'."
  echo "    Existing entries in test are kept and may be overwritten if IDs match."
  echo ""
  read -p "Type 'yes' to continue: " CONFIRM
  if [ "$CONFIRM" != "yes" ]; then
    echo "Aborted."
    exit 1
  fi
fi

echo ""

mkdir -p "$SCRIPT_DIR/../bin"

# ─── Execute ───────────────────────────────────────────────────
if [ "$MODE" = "clone" ]; then
  # ── Step 1: Check if the environment exists, delete if so ──
  echo "🔍 Checking if $CONTENTFUL_ENVIRONMENT_ID exists..."
  ENV_LIST=$(contentful space environment list \
    --space-id "$GATSBY_CONTENTFUL_SPACE_ID" \
    --management-token "$CONTENTFUL_MANAGEMENT_TOKEN" 2>/dev/null || echo "")

  if echo "$ENV_LIST" | grep -qw "$CONTENTFUL_ENVIRONMENT_ID"; then
    echo "🗑️  Deleting $CONTENTFUL_ENVIRONMENT_ID..."
    echo "y" | contentful space environment delete \
      --space-id "$GATSBY_CONTENTFUL_SPACE_ID" \
      --environment-id "$CONTENTFUL_ENVIRONMENT_ID" \
      --management-token "$CONTENTFUL_MANAGEMENT_TOKEN" || true
    echo "⏳ Waiting for deletion to propagate..."
    sleep 15
  else
    echo "ℹ️  $CONTENTFUL_ENVIRONMENT_ID doesn't exist — skipping delete."
  fi

  # ── Step 2: Create from source (clones schema + entries + assets) ──
  echo ""
  echo "📋 Creating $CONTENTFUL_ENVIRONMENT_ID from $CONTENTFUL_PROD_ENV..."
  contentful space environment create \
    --space-id "$GATSBY_CONTENTFUL_SPACE_ID" \
    --environment-id "$CONTENTFUL_ENVIRONMENT_ID" \
    --name "Test" \
    --source "$CONTENTFUL_PROD_ENV" \
    --management-token "$CONTENTFUL_MANAGEMENT_TOKEN"

  echo ""
  echo "⏳ Waiting for clone to complete (this can take a few minutes)..."
  echo "   Polling until $CONTENTFUL_ENVIRONMENT_ID is ready..."

  MAX_WAIT=600
  ELAPSED=0
  INTERVAL=10

  while [ "$ELAPSED" -lt "$MAX_WAIT" ]; do
    STATUS=$(contentful space environment list \
      --space-id "$GATSBY_CONTENTFUL_SPACE_ID" \
      --management-token "$CONTENTFUL_MANAGEMENT_TOKEN" 2>/dev/null \
      | grep -A 5 -w "$CONTENTFUL_ENVIRONMENT_ID" \
      | grep -i "status" \
      | head -1 || echo "")

    if echo "$STATUS" | grep -qi "ready"; then
      echo "✅ $CONTENTFUL_ENVIRONMENT_ID is ready."
      break
    fi

    sleep "$INTERVAL"
    ELAPSED=$((ELAPSED + INTERVAL))
    echo "   ...still waiting ($ELAPSED s)"
  done

  if [ "$ELAPSED" -ge "$MAX_WAIT" ]; then
    echo "⚠️  Timed out waiting for environment to be ready. Continuing anyway..."
  fi

  # ── Step 3: Verify schema matches (safety net) ──
  echo ""
  echo "🔍 Verifying schema matches $CONTENTFUL_PROD_ENV..."
  MIGRATION_FILE="$SCRIPT_DIR/../bin/migration-check.js"
  rm -f "$MIGRATION_FILE"

  contentful space environment diff \
    --space-id "$GATSBY_CONTENTFUL_SPACE_ID" \
    --source-environment-id "$CONTENTFUL_ENVIRONMENT_ID" \
    --target-environment-id "$CONTENTFUL_PROD_ENV" \
    --management-token "$CONTENTFUL_MANAGEMENT_TOKEN" \
    --export-file "$MIGRATION_FILE" || true

  if [ -f "$MIGRATION_FILE" ] && [ "$(wc -c < "$MIGRATION_FILE")" -gt 100 ]; then
    echo ""
    echo "⚠️  Schema diff detected — applying migration to $CONTENTFUL_ENVIRONMENT_ID..."
    contentful space migration \
      --space-id "$GATSBY_CONTENTFUL_SPACE_ID" \
      --environment-id "$CONTENTFUL_ENVIRONMENT_ID" \
      --management-token "$CONTENTFUL_MANAGEMENT_TOKEN" \
      "$MIGRATION_FILE" \
      --yes
    echo "✅ Schema migration applied."
  else
    echo "✅ No schema differences — $CONTENTFUL_ENVIRONMENT_ID matches $CONTENTFUL_PROD_ENV."
  fi

  echo ""
  echo "✅ Done. $CONTENTFUL_ENVIRONMENT_ID is now an exact clone of $CONTENTFUL_PROD_ENV."

else
  # ── Merge mode: export from prod, import into test ──
  EXPORT_FILE="$SCRIPT_DIR/../bin/master-export.json"

  echo "📦 Exporting from $CONTENTFUL_PROD_ENV..."
  contentful space export \
    --space-id "$GATSBY_CONTENTFUL_SPACE_ID" \
    --environment-id "$CONTENTFUL_PROD_ENV" \
    --management-token "$CONTENTFUL_MANAGEMENT_TOKEN" \
    --content-file "$EXPORT_FILE" \
    --include-drafts false

  echo ""
  echo "🚀 Importing into $CONTENTFUL_ENVIRONMENT_ID..."
  contentful space import \
    --space-id "$GATSBY_CONTENTFUL_SPACE_ID" \
    --environment-id "$CONTENTFUL_ENVIRONMENT_ID" \
    --management-token "$CONTENTFUL_MANAGEMENT_TOKEN" \
    --content-file "$EXPORT_FILE"

  echo ""
  echo "✅ Done. $CONTENTFUL_PROD_ENV content merged into $CONTENTFUL_ENVIRONMENT_ID."
fi