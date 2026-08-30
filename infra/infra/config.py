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

# What GitHub's OIDC token "sub" claim must match for each deploy role.
# dev deploys run on a push to the `dev` branch (no GitHub environment);
# prod deploys run through the protected `production` environment.
# TODO: tighten GITHUB_DEV_SUB back to ":ref:refs/heads/dev" once the debug
# step confirms the exact sub GitHub sends.
GITHUB_DEV_SUB = f"repo:{GITHUB_OWNER}/{GITHUB_REPO}:*"
GITHUB_PROD_SUB = f"repo:{GITHUB_OWNER}/{GITHUB_REPO}:environment:production"
