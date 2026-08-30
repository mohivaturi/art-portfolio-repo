#!/usr/bin/env python3
import os

import aws_cdk as cdk

from infra.cicd_stack import PortfolioCicdStack
from infra.config import ENVIRONMENTS
from infra.portfolio_stack import PortfolioStack

app = cdk.App()

# CDK_DEFAULT_ACCOUNT / _REGION are set by the CDK CLI from your AWS creds
# (locally from `aws configure`, in CI from the configured credentials).
env = cdk.Environment(
    account=os.getenv("CDK_DEFAULT_ACCOUNT"),
    region=os.getenv("CDK_DEFAULT_REGION", "us-east-1"),
)

for env_name, env_config in ENVIRONMENTS.items():
    PortfolioStack(
        app,
        f"PortfolioStack-{env_name}",
        env_config=env_config,
        env=env,
    )

PortfolioCicdStack(app, "PortfolioCicdStack", env=env)

app.synth()
