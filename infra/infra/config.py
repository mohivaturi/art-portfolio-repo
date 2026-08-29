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
