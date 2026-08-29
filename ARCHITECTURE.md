# Artist Portfolio — Architecture Plan

## 1. Summary

A static portfolio website (React + Vite) hosted on AWS via S3 + CloudFront,
with a small Python Lambda backend for the contact form. Infrastructure is
defined entirely in **AWS CDK (Python)**, which synthesizes the
**CloudFormation** templates that actually deploy the resources — CDK and
CloudFormation aren't competing choices here, CDK is the tool, CloudFormation
is the output. One AWS account holds both environments; deploys are triggered
by GitHub branch, using two separate IAM users with GitHub Actions.

## 2. Repo layout (monorepo)

```
artist-portfolio/
├── frontend/               # React + Vite static site
│   ├── src/
│   ├── public/
│   └── vite.config.ts
├── backend/                # Python Lambda(s)
│   └── contact_form/
│       └── handler.py
├── infra/                  # AWS CDK app (Python)
│   ├── app.py
│   ├── infra/
│   │   ├── portfolio_stack.py
│   │   └── config.py       # per-env settings (dev/prod)
│   ├── cdk.json
│   └── requirements.txt
├── .github/
│   └── workflows/
│       ├── deploy-dev.yml
│       └── deploy-prod.yml
└── ARCHITECTURE.md
```

## 3. AWS resources (per environment)

Each environment (`dev`, `prod`) gets its own copy of the same CDK stack,
distinguished by a resource-name prefix (`dev-*` / `prod-*`) and CDK context,
all in the **same AWS account**.

| Resource | Purpose |
|---|---|
| S3 bucket (private) | Hosts built static frontend assets. Not publicly readable — CloudFront reaches it via Origin Access Control (OAC). |
| CloudFront distribution | CDN + HTTPS in front of the S3 bucket. Custom error responses route 403/404 to `index.html` (SPA routing). |
| ACM certificate (us-east-1) | TLS cert for CloudFront, if/when you attach a custom domain. |
| Route 53 hosted zone (optional) | DNS, only if you buy/point a custom domain. |
| Lambda (Python) | Handles contact form submissions. |
| API Gateway (HTTP API) | Public endpoint the frontend calls (`POST /contact`), proxies to the Lambda. |
| SES | Sends the actual contact-form email notification. |
| CloudWatch Logs | Lambda + API Gateway logs. |
| S3 bucket (CDK bootstrap) | Auto-created by `cdk bootstrap`, one-time, not app-specific. |

Deliberately **not** included for v1: no database, no auth, no admin/upload
panel. Artwork images and metadata ship as static files inside the frontend
build. This keeps the backend surface to exactly one job (contact form) and
avoids building a CMS you don't need yet. If you later want to add/update
artwork without redeploying, the natural extension is DynamoDB + a `GET
/artworks` Lambda — same pattern, added later, not now.

## 4. IAM / account structure

- **One AWS account**, two IAM users: `portfolio-dev-deployer`,
  `portfolio-prod-deployer`.
- Each has an access key + secret, stored as GitHub Actions secrets scoped to
  a **GitHub Environment** (`dev` and `production`), not repo-wide secrets.
- Each user's policy is scoped as tightly as practical: permissions limited to
  CloudFormation, S3, CloudFront, Lambda, API Gateway, SES, IAM-pass-role, and
  the CDK bootstrap roles — restricted by resource-name prefix (`dev-*` /
  `prod-*`) where the service supports it.
- The `production` GitHub Environment has a **required reviewer** rule, so a
  push to `master` builds automatically but the actual `cdk deploy` step
  pauses for manual approval before touching prod.
- Note for later: AWS's current recommended pattern is GitHub OIDC federation
  (no stored credentials at all, short-lived tokens). You chose static IAM
  users for simplicity, which is fine for a low-traffic personal site — just
  rotate both access keys periodically (e.g. every 90 days) and never commit
  them anywhere.

## 5. Branch → environment mapping

| Branch | Environment | AWS identity | CloudFront/S3 |
|---|---|---|---|
| `dev` | dev | `portfolio-dev-deployer` | `dev-portfolio-*` resources |
| `master` | prod | `portfolio-prod-deployer` | `prod-portfolio-*` resources |

## 6. CI/CD (GitHub Actions)

Two workflows, near-identical, differing only in branch trigger, environment
name, and which secrets they pull:

**`deploy-dev.yml`** — triggers on push to `dev`:
1. Checkout
2. Set up Node, install + build `frontend/` (`vite build`)
3. Set up Python, install `infra/requirements.txt`
4. Configure AWS credentials from the `dev` GitHub Environment secrets
5. `cdk synth` (sanity check the CloudFormation output)
6. `cdk deploy PortfolioStack-dev --require-approval never`
7. Sync `frontend/dist` to the dev S3 bucket
8. Create a CloudFront invalidation (`/*`) on the dev distribution

**`deploy-prod.yml`** — same steps, triggered on push to `master`, using the
`production` GitHub Environment (manual approval gate), deploying
`PortfolioStack-prod`.

Both workflows also run frontend lint/test and `cdk synth --strict` on every
PR (not just on merge) so infra/frontend mistakes surface before merge, not
after.

## 7. Security notes

- S3 buckets: block all public access, encrypted at rest (SSE-S3), only
  reachable via CloudFront OAC.
- Contact form Lambda: input validation + basic rate limiting via API Gateway
  throttling, to avoid it being used as an open mail relay.
- Secrets (IAM access keys) live only in GitHub Environment secrets, never in
  code or CDK context files.
- CloudTrail left on (default in most accounts) so IAM user activity is
  auditable.

## 8. Cost expectations

At personal-portfolio traffic levels this stays inside or very close to AWS
free tier: S3 + CloudFront + Lambda + API Gateway + SES low-volume usage are
all free-tier eligible for the first 12 months and cheap after (a few dollars
a month at most, dominated by CloudFront requests and S3 storage for images).

## 9. Build order (what we'll actually do, step by step)

1. Bootstrap the repo: folder structure above, `.gitignore`, initial commit.
2. `cdk init` the `infra/` app in Python, add the S3 + CloudFront stack (no
   Lambda yet) — get a blank static site deploying to dev manually via `cdk
   deploy` from your machine.
3. Add the two IAM users + scoped policies (by hand or as a small one-time
   CDK/CLI step), generate access keys.
4. Wire up `deploy-dev.yml` GitHub Actions workflow, push to `dev` branch,
   confirm automated deploy works end-to-end.
5. Add `deploy-prod.yml`, GitHub `production` environment with required
   reviewer, confirm a `master` push deploys after approval.
6. Scaffold the React + Vite frontend (basic pages: home, gallery, about,
   contact), replace the placeholder site.
7. Add the Python Lambda + API Gateway + SES contact form, wire the frontend
   form to call it.
8. (Optional, later) custom domain: Route 53 + ACM + CloudFront alias.
9. (Optional, later) DynamoDB-backed artwork API if static files become
   annoying to maintain.

We'll go through these in order, one at a time.
