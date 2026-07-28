import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const githubActionsCiMeta = {
  overviewBody: `GitHub Actions is your production pipeline as code — but YAML without discipline becomes slow, flaky, and a secret-leak waiting to happen.

This guide covers pipeline shape that fails fast and caches smart, matrix strategies that don't 10× your bill, OIDC to cloud without long-lived keys, pinning third-party actions, secrets hygiene, and preview deploy patterns teams actually ship with.`,
  objectives: [
    "Structure workflows: lint → test → build → deploy with parallelization and fail-fast",
    "Cache dependencies and build artifacts without stale poisoned caches",
    "Use matrix builds for cross-version/OS without redundant work",
    "Configure OIDC federation to AWS/GCP/Azure and eliminate static cloud credentials in CI",
  ],
  prerequisites: [
    "GitHub repo with at least one workflow file",
    "Basic familiarity with npm/pnpm and test runners",
    "Deployed an app to a hosting provider or cloud account",
  ],
  takeaways: [
    "Pin actions to full commit SHAs; dependabot for action updates",
    "OIDC role assumption beats AWS_ACCESS_KEY_ID in repo secrets",
    "Preview deploys per PR need teardown and URL commenting — not orphan stacks",
    "CI speed comes from caching, parallelism, and not re-running unchanged work",
  ],
};

export const githubActionsCiSections: HubSection[] = [
  sec(
    "pipeline-shape",
    "1. Pipeline shape — fail fast, deploy last",
    `Standard product pipeline stages:

1. Trigger — push to main, pull_request, workflow_dispatch
2. Lint + typecheck — cheap, run in parallel with unit tests
3. Unit tests — matrix if multi-version
4. Integration tests — DB service container, longer timeout
5. Build — produce artifact (Docker image, .next, dist/)
6. Deploy — only on main or release tag; preview on PR

Job graph example:
jobs: lint, test, build (needs: lint, test), deploy (needs: build, if: github.ref == refs/heads/main)

Fail fast: run lint before 20-minute E2E. Use concurrency group to cancel superseded PR runs:
concurrency: group: ci-\${{ github.ref }}, cancel-in-progress: true

Reusable workflows — extract deploy.yml called by multiple repos; pass inputs/secrets explicitly.

Anti-pattern: one 45-minute job that lint-test-build-deploy serially — developers ignore red CI.`,
    {
      checklist: [
        "Lint and unit tests parallelized",
        "Deploy gated to protected branches",
        "Concurrency cancels outdated PR runs",
      ],
    }
  ),
  sec(
    "caching",
    "2. Caching — speed without stale lies",
    `actions/cache for:
• npm/pnpm/yarn store
• Next.js .next/cache
• Turborepo remote cache (Vercel or self-hosted)
• Docker layer cache (buildx cache-to/cache-from)

Cache key must include lockfile hash:
key: \${{ runner.os }}-pnpm-\${{ hashFiles('pnpm-lock.yaml') }}
restore-keys: \${{ runner.os }}-pnpm-

Poisoned cache symptom: "works in CI after cache clear." Fix: include toolchain version in key (node-version).

Do not cache:
• Secrets or .env
• node_modules directly (cache store instead — faster restore)

Artifact handoff between jobs:
upload-artifact / download-artifact for build output — avoid rebuilding in deploy job.

Remote cache (Turbo/Sccache): shared across runners — bigger win for monorepos than local actions/cache alone.`,
    {
      bullets: [
        "Lockfile hash in every dependency cache key",
        "Next.js/Turbo cache keys include framework version",
        "Artifacts pass build output to deploy job",
      ],
    }
  ),
  sec(
    "matrix",
    "3. Matrix builds — coverage without waste",
    `strategy.matrix for Node versions, OS, or package in monorepo:
matrix: node: [20, 22], os: [ubuntu-latest]

Use include/exclude to skip nonsense combos (Windows + Docker-only tests).

fail-fast: false when you want full signal on all matrix legs; true for quick PR feedback.

Sharding tests:
• Split by directory or jest --shard=1/4
• Parallel jobs, merge coverage in final job

Monorepo: path filters (dorny/paths-filter) — skip backend CI when only frontend markdown changed.

Cost control: matrix 4 OS × 3 Node × 2 browsers = 24× minutes. Default to ubuntu-latest + one Node; expand matrix nightly.`,
    {
      checklist: [
        "Path filters skip irrelevant jobs",
        "Matrix size justified; not default on every PR",
        "Test sharding for suites >10 min",
      ],
    }
  ),
  sec(
    "oidc",
    "4. OIDC to cloud — no long-lived keys in GitHub",
    `GitHub OIDC issues short-lived JWT (ACTIONS_ID_TOKEN_REQUEST_TOKEN) per workflow run.

AWS pattern:
permissions: id-token: write, contents: read
aws-actions/configure-aws-credentials@v4 with role-to-assume: arn:aws:iam::ACCOUNT:role/github-deploy

Trust policy on IAM role:
• StringEquals token.actions.githubusercontent.com:sub: repo:org/repo:ref:refs/heads/main
• StringEquals token.actions.githubusercontent.com:aud: sts.amazonaws.com

GCP: google-github-actions/auth with workload identity federation.
Azure: azure/login with federated credentials.

Benefits:
• No AWS_ACCESS_KEY_ID rotation nightmares
• Role scoped per repo/environment
• Audit trail ties deploy to exact commit

Environments (GitHub): production requires reviewer; environment secrets + protection rules.`,
    {
      bullets: [
        "Cloud deploy uses OIDC role, not static access keys",
        "IAM trust scoped to repo + branch/environment",
        "id-token: write permission on deploy jobs",
      ],
    }
  ),
  sec(
    "pinned-actions",
    "5. Pinned actions and supply chain",
    `Pin third-party actions to full commit SHA, not @v4 floating tag:
uses: actions/checkout@b4ffde65f46336ab88eb136be10520a2b3398352 # v4.1.1

Why: tag can be retargeted; SHA is immutable.

Dependabot version updates for actions — weekly PR bumps SHAs.

Prefer official actions (actions/*, github/*) over random user/action-name.

For composite actions in your org: version with tags you control; consumers pin SHA.

Minimal permissions per job:
permissions: contents: read — escalate only on deploy job.

Fork PR safety: secrets unavailable to fork PRs by default; never run untrusted code with secrets (pull_request_target is dangerous — understand before using).`,
    {
      checklist: [
        "All third-party actions pinned to SHA",
        "Dependabot configured for actions ecosystem",
        "Least-privilege permissions per job",
      ],
    }
  ),
  sec(
    "secrets",
    "6. Secrets — scope, rotation, and leaks",
    `Hierarchy:
• Organization secrets — shared tooling tokens
• Repository secrets — repo-specific
• Environment secrets — production vs staging + approval gates

Never:
• Echo secrets in logs (GitHub masks known secrets — custom base64 still leaks)
• Pass secrets to fork PR workflows
• Commit .env — use gitleaks/trufflehog in CI

Rotation: document owner and cadence for each secret. Prefer OIDC over stored cloud keys.

GITHUB_TOKEN: default scoped to repo; pass explicitly as npm token only when needed.

Secret scanning + push protection — enable org-wide.

For preview deploys: use short-lived tokens or scoped deploy keys per environment, not production admin creds.`,
  ),
  sec(
    "preview-deploys",
    "7. Preview deploys on pull requests",
    `Pattern:
1. PR opened/sync → build → deploy to ephemeral URL
2. Comment URL on PR (github-script or provider integration)
3. PR closed → teardown resources

Implementations:
• Vercel/Netlify/Fly — native GitHub integration
• Custom: deploy to k8s namespace pr-123, or AWS preview stack via CDK

Requirements:
• Unique URL per PR (pr-123.preview.app)
• Database: isolated schema, seeded fixture, or neon branch — never share prod DB
• Teardown on close — cron cleanup for orphaned previews

Label-gated previews: deploy only on label preview to save cost.

Smoke test preview URL in CI (curl health, Playwright against preview base URL).`,
    {
      checklist: [
        "Preview URL posted to PR",
        "Teardown on PR close documented and automated",
        "Preview uses non-production data",
      ],
    }
  ),
  sec(
    "operational",
    "8. Operational CI checklist",
    `Before calling pipeline "done":

Reliability
• Flaky tests quarantined or fixed — not re-run until green
• Timeouts on every job
• Required checks branch-protected on main

Speed
• Median PR feedback <10 min for lint+unit
• Caches monitored for hit rate

Security
• OIDC for cloud; secrets inventoried
• Actions pinned; dependabot enabled

Observability
• Slack/email on main failure
• Deploy job records version/sha in environment

Runbook: how to re-run failed deploy, rollback artifact, clear bad cache.

CI is product infrastructure — treat breaking main with the same urgency as breaking prod.`,
    {
      bullets: [
        "Branch protection requires green CI",
        "Main failure notifies team",
        "Rollback path from last green artifact",
      ],
    }
  ),
];
