"""Static-site stack: private S3 bucket + CloudFront (OAC).

No Lambda / API Gateway yet — that arrives in ARCHITECTURE.md step 7.
Bucket content is pushed separately (`aws s3 sync` locally, GitHub Actions
later); CDK does not manage the objects.

When ``env_config`` carries both ``domain_name`` and ``hosted_zone_id``
(prod, once the Route 53 zone exists), the distribution also serves
``<domain>`` and ``www.<domain>`` over an ACM cert, with Route 53 alias
records. The zone id is passed in from config rather than looked up, so
synth needs no AWS credentials.
"""

from aws_cdk import (
    CfnOutput,
    Duration,
    RemovalPolicy,
    Stack,
    aws_certificatemanager as acm,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_route53 as route53,
    aws_route53_targets as route53_targets,
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

        # --- Custom domain (prod, once the Route 53 zone exists) ---------
        domain = env_config.domain_name
        zone_id = env_config.hosted_zone_id
        use_domain = bool(domain and zone_id)
        domain_names: list[str] = []
        certificate: acm.ICertificate | None = None
        hosted_zone: route53.IHostedZone | None = None
        if use_domain:
            domain_names = [domain, f"www.{domain}"]
            hosted_zone = route53.HostedZone.from_hosted_zone_attributes(
                self, "HostedZone", hosted_zone_id=zone_id, zone_name=domain
            )
            # CloudFront reads the cert from us-east-1; this stack is there.
            certificate = acm.Certificate(
                self,
                "SiteCertificate",
                domain_name=domain,
                subject_alternative_names=[f"www.{domain}"],
                validation=acm.CertificateValidation.from_dns(hosted_zone),
            )

        # --- CloudFront: HTTPS CDN in front of the bucket ------------------
        distribution = cloudfront.Distribution(
            self,
            "SiteDistribution",
            comment=f"{env_config.prefix} static site",
            default_root_object="index.html",
            domain_names=domain_names or None,
            certificate=certificate,
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

        # --- Route 53: point the domain at CloudFront --------------------
        if use_domain and hosted_zone is not None:
            target = route53.RecordTarget.from_alias(
                route53_targets.CloudFrontTarget(distribution)
            )
            for label, record_name in (("Apex", None), ("Www", "www")):
                common = {"zone": hosted_zone, "target": target}
                if record_name:
                    common["record_name"] = record_name
                route53.ARecord(self, f"{label}ARecord", **common)
                route53.AaaaRecord(self, f"{label}AaaaRecord", **common)

        # --- Outputs -----------------------------------------------------
        CfnOutput(self, "BucketName", value=bucket.bucket_name)
        CfnOutput(self, "DistributionId", value=distribution.distribution_id)
        CfnOutput(
            self,
            "SiteURL",
            value=f"https://{distribution.distribution_domain_name}",
        )
        if use_domain:
            CfnOutput(self, "SiteDomain", value=f"https://{domain}")
