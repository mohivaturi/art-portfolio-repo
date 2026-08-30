"""CI/CD identity: GitHub OIDC provider + per-environment deploy roles.

GitHub Actions assumes these roles with a short-lived OIDC token; no access
keys are stored anywhere (ARCHITECTURE.md section 4, "note for later").

Deployed once by an admin. After that the `dev` / `main` workflows use the
roles' ARNs (see CfnOutputs) to deploy without credentials.
"""

from aws_cdk import (
    CfnOutput,
    Duration,
    Stack,
    aws_iam as iam,
)
from constructs import Construct

from infra.config import (
    ENVIRONMENTS,
    GITHUB_DEV_SUB,
    GITHUB_PROD_SUB,
)

_GITHUB_OIDC_URL = "https://token.actions.githubusercontent.com"


class PortfolioCicdStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        provider = iam.OpenIdConnectProvider(
            self,
            "GitHubOidcProvider",
            url=_GITHUB_OIDC_URL,
            client_ids=["sts.amazonaws.com"],
        )

        self._make_role("dev", provider, GITHUB_DEV_SUB, sub_match="StringLike")
        self._make_role("prod", provider, GITHUB_PROD_SUB, sub_match="StringEquals")

    def _make_role(
        self,
        env_name: str,
        provider: iam.OpenIdConnectProvider,
        sub: str,
        *,
        sub_match: str,
    ) -> None:
        env_config = ENVIRONMENTS[env_name]
        bucket_arn = f"arn:aws:s3:::{env_config.prefix}-site-{self.account}"

        principal = iam.OpenIdConnectPrincipal(
            provider,
            conditions={
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
                },
                sub_match: {
                    "token.actions.githubusercontent.com:sub": sub,
                },
            },
        )

        role = iam.Role(
            self,
            f"{env_name.title()}DeployRole",
            role_name=f"portfolio-{env_name}-deploy-role",
            assumed_by=principal,
            max_session_duration=Duration.hours(1),
            description=f"GitHub Actions deploy role for the {env_name} environment",
        )

        # `cdk deploy` works entirely through the CDK bootstrap roles.
        role.add_to_policy(
            iam.PolicyStatement(
                sid="AssumeCdkBootstrapRoles",
                actions=["sts:AssumeRole"],
                resources=[f"arn:aws:iam::{self.account}:role/cdk-hnb659fds-*"],
            )
        )
        # Pre-flight checks the CDK CLI does with ambient creds before it
        # assumes the bootstrap roles (stack lookup + bootstrap version).
        role.add_to_policy(
            iam.PolicyStatement(
                sid="ReadCloudFormation",
                actions=[
                    "cloudformation:DescribeStacks",
                    "cloudformation:GetTemplate",
                    "cloudformation:ListStacks",
                ],
                resources=["*"],
            )
        )
        role.add_to_policy(
            iam.PolicyStatement(
                sid="ReadCdkBootstrapVersion",
                actions=["ssm:GetParameter"],
                resources=[
                    f"arn:aws:ssm:*:{self.account}:parameter/cdk-bootstrap/*"
                ],
            )
        )
        # The workflow uploads the built site and busts the CDN cache directly.
        role.add_to_policy(
            iam.PolicyStatement(
                sid="SyncSiteBucket",
                actions=[
                    "s3:ListBucket",
                    "s3:GetObject",
                    "s3:PutObject",
                    "s3:DeleteObject",
                ],
                resources=[bucket_arn, f"{bucket_arn}/*"],
            )
        )
        role.add_to_policy(
            iam.PolicyStatement(
                sid="InvalidateCloudFront",
                actions=[
                    "cloudfront:CreateInvalidation",
                    "cloudfront:GetInvalidation",
                    "cloudfront:ListDistributions",
                ],
                resources=["*"],
            )
        )

        CfnOutput(
            self,
            f"{env_name.title()}DeployRoleArn",
            value=role.role_arn,
            description=f"role-to-assume for the {env_name} GitHub Actions workflow",
        )
