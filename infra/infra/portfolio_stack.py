"""Static-site stack: private S3 bucket + CloudFront (OAC).

No Lambda / API Gateway yet — that arrives in ARCHITECTURE.md step 7.
Bucket content is pushed separately (`aws s3 sync` locally, GitHub Actions
later); CDK does not manage the objects.
"""

from aws_cdk import (
    CfnOutput,
    Duration,
    RemovalPolicy,
    Stack,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_s3 as s3,
)
from constructs import Construct

from infra.config import EnvConfig


class PortfolioStack(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        *,
        env_config: EnvConfig,
        **kwargs,
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        is_dev = env_config.name == "dev"

        # --- S3: private bucket, CloudFront-only access ---------------------
        bucket = s3.Bucket(
            self,
            "SiteBucket",
            bucket_name=f"{env_config.prefix}-site-{self.account}",
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            encryption=s3.BucketEncryption.S3_MANAGED,
            enforce_ssl=True,
            versioned=not is_dev,
            # dev is disposable; prod bucket survives a stack delete
            removal_policy=RemovalPolicy.DESTROY if is_dev else RemovalPolicy.RETAIN,
            auto_delete_objects=is_dev,
        )

        # --- CloudFront: HTTPS CDN in front of the bucket ------------------
        distribution = cloudfront.Distribution(
            self,
            "SiteDistribution",
            comment=f"{env_config.prefix} static site",
            default_root_object="index.html",
            default_behavior=cloudfront.BehaviorOptions(
                origin=origins.S3BucketOrigin.with_origin_access_control(bucket),
                viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            ),
            # SPA routing: send auth/not-found back to index.html
            error_responses=[
                cloudfront.ErrorResponse(
                    http_status=status,
                    response_http_status=200,
                    response_page_path="/index.html",
                    ttl=Duration.minutes(5),
                )
                for status in (403, 404)
            ],
        )

        # --- Outputs -----------------------------------------------------
        CfnOutput(self, "BucketName", value=bucket.bucket_name)
        CfnOutput(self, "DistributionId", value=distribution.distribution_id)
        CfnOutput(
            self,
            "SiteURL",
            value=f"https://{distribution.distribution_domain_name}",
        )
