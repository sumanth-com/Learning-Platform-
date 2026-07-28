import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const awsDeploymentGuideMeta = {
  overviewBody: `AWS production deployment for a typical web API is a VPC with public edge, private compute, managed database, and secrets that never touch git.

This guide walks the reference layout: ALB → private ECS/EC2/ASG app tier → RDS in isolated subnets, secrets via SSM/Secrets Manager, health checks that actually predict readiness, blue/green rollout, migration ordering, and the cost traps that inflate bills silently.`,
  objectives: [
    "Design a 3-tier VPC (public / private app / private data) with correct security groups",
    "Wire ALB health checks, target groups, and private service discovery",
    "Manage secrets, env config, and IAM least privilege for runtime",
    "Execute blue/green deploys and database migrations without downtime surprises",
  ],
  prerequisites: [
    "Basic AWS console familiarity (VPC, EC2, RDS)",
    "Deployed at least one containerized or Node/Python app",
    "Understand DNS, TLS certificates, and environment variables",
  ],
  takeaways: [
    "RDS and app servers live in private subnets; only ALB is internet-facing",
    "Health checks must hit a dependency-aware readiness endpoint, not /",
    "Run migrations before traffic shift — backward-compatible expand/contract",
    "NAT Gateway, idle RDS, and cross-AZ data transfer are the usual cost leaks",
  ],
};

export const awsDeploymentGuideSections: HubSection[] = [
  sec(
    "vpc",
    "1. VPC layout: ALB → private app → RDS",
    `Standard production VPC (/16):

Subnets (2+ AZs minimum):
• public — ALB, NAT Gateway (one per AZ or shared — cost trade-off)
• private-app — ECS tasks / EC2 ASG, no public IP
• private-data — RDS, ElastiCache; no route to internet

Routing:
• public: 0.0.0.0/0 → IGW
• private-app: 0.0.0.0/0 → NAT (for outbound Stripe, npm, APIs)
• private-data: no default route — only intra-VPC

Security groups (stateful):
• ALB-SG: inbound 443 from 0.0.0.0/0; outbound to App-SG:app_port
• App-SG: inbound app_port from ALB-SG only; outbound 5432 to RDS-SG, 443 to 0.0.0.0/0 via NAT
• RDS-SG: inbound 5432 from App-SG only

Anti-pattern: RDS with publicly accessible = yes because "it's easier to connect from laptop." Use SSM port forward or VPN instead.`,
    {
      diagram: `Internet → ALB (public subnets)
              → App tasks (private-app)
              → RDS (private-data)`,
      checklist: [
        "2 AZ minimum for ALB and RDS Multi-AZ",
        "Flow logs enabled on VPC for incident debug",
        "NACLs default; SG is primary control",
      ],
    }
  ),
  sec(
    "compute",
    "2. Compute: ECS Fargate vs EC2 ASG",
    `Pick based on ops headcount and scale predictability.

ECS Fargate (default for small/medium teams):
• No host patching; pay per vCPU-GB
• Task in private subnet, awsvpc mode
• Task role (app AWS API access) ≠ execution role (pull image, read secrets)

EC2 ASG:
• Cheaper at steady high utilization; you patch AMIs
• Use when you need daemonsets, GPU, or custom networking

Sizing start:
• 0.5 vCPU / 1GB for light API; 1 vCPU / 2GB for typical Node/Go
• Autoscale on CPU p95 > 60% or request count per target
• min=2 tasks across AZs for HA

Container registry: ECR with image scan on push; lifecycle policy delete untagged >7 days.`,
    {
      bullets: [
        "Deploy circuit: new task must pass health check before old drained",
        "Graceful shutdown: SIGTERM handler finishes in-flight requests (30s)",
        "Pin base image digest in prod, not :latest",
      ],
    }
  ),
  sec(
    "secrets",
    "3. Secrets & configuration",
    `Secrets never in task definition plaintext or git.

Pattern:
• SSM Parameter Store (SecureString) or Secrets Manager for DATABASE_URL, API keys
• Reference in ECS task definition secrets block → injected as env at launch
• KMS CMK for encryption; IAM policy least privilege per service

Rotation:
• Secrets Manager rotation lambda for RDS master (or use IAM DB auth later)
• App supports credential refresh on connection error + retry

Config tiers:
• Build-time: version, git sha (non-secret)
• Runtime: feature flags, pool sizes — env or SSM
• Per-deploy: migration version

IAM:
• Task role: s3:GetObject on specific prefix, sqs:SendMessage on one queue — not *
• CI OIDC to AWS — no long-lived access keys on GitHub`,
    {
      checklist: [
        "terraform/CloudFormation never outputs secret values",
        "Local dev uses .env.local gitignored; prod uses SSM",
        "Audit who can ssm:GetParameter on prod paths",
      ],
    }
  ),
  sec(
    "health",
    "4. Health checks & readiness",
    `ALB health check must predict "can serve real traffic" — not return 200 static page.

Endpoints:
• /health/live — process up (liveness)
• /health/ready — DB ping, cache ping, migrations at head (readiness)

ALB settings starting point:
• path: /health/ready
• interval 15s, healthy threshold 2, unhealthy 3
• matcher HTTP 200 only
• deregistration delay 30s (align with connection drain)

Common failures:
• Check hits DB but app still starting → mark unhealthy too long — split live vs ready in orchestrator
• Security group missing ALB → task path
• Health check too aggressive during deploy → flapping

Container healthcheck in Dockerfile is backup; ALB is source of truth for traffic.`,
  ),
  sec(
    "bluegreen",
    "5. Blue/green & rolling deploys",
    `Goal: zero-downtime deploy with instant rollback.

ECS rolling:
• minimumHealthyPercent 100, maximumPercent 200 → new tasks before old die
• CodeDeploy blue/green for ALB traffic shift with bake timer

Steps:
1. Build + scan image → push ECR with immutable tag (git sha)
2. Run DB migrations (backward compatible) from CI job — not from app boot
3. Deploy green service/task set
4. Health checks pass → shift ALB listener rule / weighted target group
5. Bake 5–15 min → drain blue
6. Rollback = revert task definition tag + shift weight back (migrations must still be compatible)

Feature flags decouple code deploy from behavior exposure.

Never scale desired count to 0 in prod for "deploy" — you lose HA during the window.`,
    {
      checklist: [
        "Rollback tested quarterly",
        "Two task definitions retained (current + previous)",
        "Deploy notifications to Slack with version + actor",
      ],
    }
  ),
  sec(
    "migrations",
    "6. Migration order & RDS ops",
    `Migration sequence for zero-downtime:

1. Expand — add nullable column / new table (deploy anytime)
2. Deploy app that writes both old and new (dual write) OR writes new only with default
3. Backfill job — fill new column in batches
4. Deploy app that reads new
5. Contract — drop old column in later release

Rules:
• Never rename column in one step — add + copy + switch + drop
• Long migrations: use CONCURRENTLY indexes on Postgres; avoid table locks in peak
• Run migrations from CI with advisory lock — not parallel on multiple containers boot

RDS:
• Multi-AZ for prod (failover ~60–120s)
• automated backups 7–35 days; test restore
• Parameter group: log slow queries >1s; connection limits sized for pool × tasks
• Read replica for reporting — not for app writes`,
    {
      bullets: [
        "Pool size × task count < max_connections − headroom",
        "Use RDS Proxy if connection churn hurts",
        "Major version upgrade in maintenance window with snapshot first",
      ],
    }
  ),
  sec(
    "observability",
    "7. Observability & ops hooks",
    `Minimum AWS ops stack:

• CloudWatch Logs — structured JSON from app; retention 30d
• CloudWatch Alarms — 5xx rate on ALB, CPU, RDS free storage, task count
• X-Ray or OTel → ADOT collector sidecar (optional but valuable)
• SNS → PagerDuty/Slack on alarm

Runbooks attached to alarms:
• RDS storage < 20%
• ALB target unhealthy > 1 min
• ECS service unable to stabilize

WAF on ALB for public APIs: rate-based rule + AWS Managed Rules core set — cheap abuse filter.`,
  ),
  sec(
    "cost",
    "8. Cost gotchas",
    `Silent bill inflators:

• NAT Gateway — $0.045/hr + $0.045/GB processed; per-AZ NAT adds up — consider NAT instance or VPC endpoints for S3/ECR/SSM
• VPC endpoints — Interface endpoints cost ~$7/mo each; S3 Gateway endpoint is free — use for ECR pull if heavy
• Idle RDS — right-size; stop dev instances nights; gp3 vs io1
• Cross-AZ data transfer — keep app and RDS same AZ when possible for hot path; accept Multi-AZ cost for HA
• CloudWatch Logs ingestion — sample debug logs; avoid logging bodies
• Public IPv4 charges (2024+) — avoid unnecessary public IPs on app tier
• Over-provisioned Fargate tasks — CPU credit unused = waste

Tag everything: env, service, owner — Cost Explorer by tag monthly.`,
    {
      checklist: [
        "Budget alert at 80% forecast",
        "Dev/staging accounts separate from prod billing",
        "Review NAT and RDS size quarterly",
      ],
    }
  ),
  sec(
    "antipatterns",
    "9. Anti-patterns",
    `• Single-AZ RDS in prod
• Running migrations on app container startup (race + lock storms)
• Security group 0.0.0.0/0 on app port
• Secrets in environment in plain CloudFormation template
• Health check on / that does not touch DB — blackholes traffic during partial outage
• :latest deploy tag with no rollback artifact
• One giant VPC peering mess instead of account separation
• Enabling SSH on app instances instead of SSM Session Manager

AWS deployment wins on boring networking and disciplined deploy order — not on exotic services.`,
  ),
];
