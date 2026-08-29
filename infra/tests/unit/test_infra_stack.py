import aws_cdk as core
import aws_cdk.assertions as assertions

from infra.config import DEV
from infra.portfolio_stack import PortfolioStack


def _template():
    app = core.App()
    stack = PortfolioStack(
        app,
        "PortfolioStack-test",
        env_config=DEV,
        env=core.Environment(account="123456789012", region="us-east-1"),
    )
    return assertions.Template.from_stack(stack)


def test_bucket_is_private_and_encrypted():
    template = _template()
    template.has_resource_properties(
        "AWS::S3::Bucket",
        {
            "PublicAccessBlockConfiguration": {
                "BlockPublicAcls": True,
                "BlockPublicPolicy": True,
                "IgnorePublicAcls": True,
                "RestrictPublicBuckets": True,
            },
        },
    )


def test_cloudfront_distribution_created():
    template = _template()
    template.resource_count_is("AWS::CloudFront::Distribution", 1)


def test_spa_error_responses():
    template = _template()
    template.has_resource_properties(
        "AWS::CloudFront::Distribution",
        {
            "DistributionConfig": assertions.Match.object_like(
                {
                    "CustomErrorResponses": assertions.Match.array_with(
                        [
                            assertions.Match.object_like(
                                {
                                    "ErrorCode": 403,
                                    "ResponseCode": 200,
                                    "ResponsePagePath": "/index.html",
                                }
                            ),
                        ]
                    ),
                }
            ),
        },
    )
