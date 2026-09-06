#!/usr/bin/env bash
# Upload the gallery images (frontend/public/work/) to the site's S3 bucket.
# They are git-ignored, so this is how they reach the deployed site.
#
#   ./scripts/sync-artwork.sh dev     # default
#   ./scripts/sync-artwork.sh prod
#
# Needs AWS creds configured locally (aws configure) and the stack deployed.
set -euo pipefail

ENV="${1:-dev}"
case "$ENV" in
  dev)  STACK="PortfolioStack-dev" ;;
  prod) STACK="PortfolioStack-prod" ;;
  *) echo "usage: $0 [dev|prod]" >&2; exit 1 ;;
esac

REGION="us-east-1"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/frontend/public/work/"

get() { aws cloudformation describe-stacks --stack-name "$STACK" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text; }

BUCKET="$(get BucketName)"
DIST="$(get DistributionId)"
echo "env=$ENV  bucket=$BUCKET"

aws s3 sync "$SRC" "s3://$BUCKET/work/" --delete \
  --cache-control "public, max-age=604800"

aws cloudfront create-invalidation --distribution-id "$DIST" --paths "/work/*" >/dev/null
echo "synced and invalidated /work/*"
