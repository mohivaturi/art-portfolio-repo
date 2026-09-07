#!/usr/bin/env bash
# Upload the site's media (frontend/public/work/ and frontend/public/about/)
# to the S3 bucket. Those folders are git-ignored, so this is how they reach
# the deployed site.
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

get() { aws cloudformation describe-stacks --stack-name "$STACK" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text; }

BUCKET="$(get BucketName)"
DIST="$(get DistributionId)"
echo "env=$ENV  bucket=$BUCKET"

for prefix in work about; do
  src="$ROOT/frontend/public/$prefix/"
  [ -d "$src" ] || continue
  aws s3 sync "$src" "s3://$BUCKET/$prefix/" --delete \
    --cache-control "public, max-age=604800"
done

aws cloudfront create-invalidation --distribution-id "$DIST" \
  --paths "/work/*" "/about/*" >/dev/null
echo "synced and invalidated /work/* /about/*"
