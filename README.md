# artist-portfolio

Static portfolio site (React + Vite) on AWS S3 + CloudFront, with a Python
Lambda contact form. Infrastructure as AWS CDK (Python).

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full design and build order.

## Layout

| Path | Purpose |
|---|---|
| `frontend/` | React + Vite static site |
| `backend/` | Python Lambda(s) — contact form |
| `infra/` | AWS CDK app (Python) |
| `.github/workflows/` | CI/CD (deploy on push to `dev` / `master`) |
