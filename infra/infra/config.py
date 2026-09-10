"""Per-environment settings.

One AWS account holds both environments; they are told apart by a
resource-name prefix (``dev-*`` / ``prod-*``) as described in ARCHITECTURE.md
sections 3 and 5.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class EnvConfig:
    name: str  # "dev" | "prod"
    prefix: str  # resource-name prefix, e.g. "dev-portfolio"
    # apex custom domain (ARCHITECTURE.md step 8). The custom domain is wired
    # up only once BOTH domain_name and hosted_zone_id are set - fill in the
    # zone id after registering the domain / creating the Route 53 zone
    # (`aws route53 list-hosted-zones-by-name --dns-name mohithivaturi.art`).
    # When active the stack also serves www.<domain_name>. dev keeps the raw
    # CloudFront URL.
    domain_name: str | None = None
    hosted_zone_id: str | None = None


DEV = EnvConfig(name="dev", prefix="dev-portfolio")
PROD = EnvConfig(
    name="prod",
    prefix="prod-portfolio",
    domain_name="mohithivaturi.art",
    hosted_zone_id="Z06956111MLKNVXEQWRFK",  # Route 53 zone for mohithivaturi.art
)

ENVIRONMENTS: dict[str, EnvConfig] = {
    "dev": DEV,
    "prod": PROD,
}

# --- CI/CD (GitHub Actions via OIDC, ARCHITECTURE.md sections 4 and 6) ---
GITHUB_OWNER = "mohivaturi"
GITHUB_REPO = "art-portfolio-repo"

# GitHub now embeds immutable numeric IDs in the OIDC token (the `sub` claim
# reads `repo:owner@<owner_id>/repo@<repo_id>:...`). We pin the stable numeric
# IDs so the trust survives an account/repo rename, and wildcard only the
# login/name segments. IAM requires a `sub` (or job_workflow_ref) condition.
GITHUB_OWNER_ID = "140132880"
GITHUB_REPO_ID = "1351519081"

_REPO_GLOB = f"repo:*@{GITHUB_OWNER_ID}/*@{GITHUB_REPO_ID}"

# Extra scoping per environment: dev = push to the `dev` branch,
# prod = the protected `production` GitHub environment.
GITHUB_DEV_REF = "refs/heads/dev"
GITHUB_DEV_SUB = f"{_REPO_GLOB}:ref:refs/heads/dev"
GITHUB_PROD_ENVIRONMENT = "production"
GITHUB_PROD_SUB = f"{_REPO_GLOB}:environment:production"
