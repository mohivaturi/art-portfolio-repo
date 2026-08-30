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
    # domain_name is wired up later (ARCHITECTURE.md step 8)
    domain_name: str | None = None


DEV = EnvConfig(name="dev", prefix="dev-portfolio")
PROD = EnvConfig(name="prod", prefix="prod-portfolio")

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
