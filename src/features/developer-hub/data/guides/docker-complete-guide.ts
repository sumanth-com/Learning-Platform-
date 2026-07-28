import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const dockerCompleteGuideMeta = {
  overviewBody: `Docker in production is reproducible builds, least-privilege runtime, and compose that mirrors prod constraints — not "docker run" on a laptop.

This guide covers multi-stage Dockerfiles, non-root users, Compose healthchecks and networking, image hygiene (SBOM, scanning, pinning), and resource limits that prevent one container from taking the host down.`,
  objectives: [
    "Write multi-stage Dockerfiles that minimize attack surface and image size",
    "Run containers as non-root with read-only rootfs where feasible",
    "Configure Compose for local dev parity: healthchecks, networks, depends_on conditions",
    "Apply prod limits, logging drivers, and image supply-chain hygiene",
  ],
  prerequisites: [
    "Used Docker Desktop or Engine locally",
    "Built a web app with package manager lockfile",
    "Basic Linux user/group and file permissions",
  ],
  takeaways: [
    "Multi-stage builds: builder stage fat, runtime stage contains only artifact + runtime deps",
    "Never run as root in prod — USER directive + correct file ownership",
    "Healthchecks in Compose must match what orchestrator uses in prod",
    "Pin base image digests; scan on CI; distroslim or alpine with glibc awareness",
  ],
};

export const dockerCompleteGuideSections: HubSection[] = [
  sec(
    "multistage",
    "1. Multi-stage Dockerfile",
    `Separate build toolchain from runtime artifact.

Pattern (Node example):
• Stage build: install devDeps, compile TS, prune
• Stage runtime: copy dist + production node_modules only

Rules:
• Order layers: base → system deps → copy lockfiles → install → copy source → build
• Leverage cache: COPY package*.json before source
• .dockerignore: node_modules, .git, tests, .env*, *.md
• One process per container — no systemd inside

Size targets:
• Node API: 150–400MB acceptable with slim base; <100MB with distroless
• Go static binary on scratch/distroless: 10–30MB

Anti-pattern: single stage with gcc, git, and 800MB node_modules in prod image.`,
    {
      code: [
        {
          language: "dockerfile",
          title: "Node multi-stage sketch",
          code: `FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package-lock.json package.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
USER node
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
        },
      ],
      checklist: [
        "docker build succeeds with --no-cache before release",
        "Image runs without bind-mount in CI smoke test",
        "EXPOSE documents port; publish in compose/k8s separately",
      ],
    }
  ),
  sec(
    "nonroot",
    "2. Non-root & filesystem hardening",
    `Root in container = root on host if kernel breakout — don't.

Steps:
• Create app user in Dockerfile: RUN useradd -r -u 10001 app
• COPY --chown=app:app or RUN chown before USER
• USER 10001 before CMD
• Writable paths only: /tmp, /var/run, explicit volume mounts
• read_only: true in Compose/K8s + tmpfs for /tmp

Capabilities:
• Drop ALL; add only CAP_NET_BIND_SERVICE if binding <1024 (prefer >1024 instead)
• no-new-privileges security option

Secrets:
• Mount secrets as files under /run/secrets — not ENV in Dockerfile
• BuildKit secrets for npm tokens during build: RUN --mount=type=secret

Distroless/static:
• No shell — great for security, harder for debug; use ephemeral debug sidecar in k8s`,
    {
      bullets: [
        "Verify with docker inspect .Config.User",
        "Fix EACCES in CI before prod — common on volume mounts",
        "Dev bind-mount: align host uid with container USER",
      ],
    }
  ),
  sec(
    "compose-health",
    "3. Compose: healthchecks & depends_on",
    `Local stack should fail fast when dependencies are not ready.

Healthcheck (service block):
\`\`\`
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health/ready"]
  interval: 10s
  timeout: 3s
  retries: 5
  start_period: 30s
\`\`\`

depends_on with condition (Compose v2):
\`\`\`
depends_on:
  db:
    condition: service_healthy
\`\`\`

Use wget/curl in slim images or native check (pg_isready for Postgres).

Do not use depends_on alone without healthcheck — app starts, crashes on DB, restart loop.

Init wrapper for Node/Python zombie reaping: init: true or tini as PID 1.`,
    {
      checklist: [
        "App waits for DB migrate before accepting traffic",
        "Health endpoint same path as prod ALB check",
        "start_period covers cold start (npm install dev only in dev stage)",
      ],
    }
  ),
  sec(
    "networking",
    "4. Compose networking",
    `Default bridge per project — services resolve by service name DNS.

Patterns:
• frontend network: web + api
• backend network: api + db + redis — db not on frontend network
• Explicit networks: prevent db exposure to reverse proxy container

Ports:
• Publish only what humans need: "8080:80" for web
• DB: no host port in prod-like compose — access via docker exec or vpn
• host.docker.internal for host machine callbacks (Mac/Win)

TLS termination at reverse proxy (Traefik/Caddy/nginx) container — not in app container for multi-service local.

Production parity: same env var names and connection strings shape as k8s/ECS task def.`,
    {
      bullets: [
        "Use internal DNS names (postgres:5432) not localhost between services",
        "Separate compose override for debug ports",
        "Document which services are edge-facing",
      ],
    }
  ),
  sec(
    "hygiene",
    "5. Image hygiene & supply chain",
    `Treat images like release artifacts.

Base images:
• Prefer official images; pin digest (@sha256:…) in prod manifests
• Renovate/bump on schedule; test before auto-merge
• bookworm-slim / alpine — know musl vs glibc for native modules

Scanning:
• docker scout / trivy / grype in CI — fail on CRITICAL with fix available
• Generate SBOM (syft) stored with image tag

Build:
• BUILDKIT=1; no secrets in ARG (layer cache leaks)
• Multi-arch only if needed (buildx) — slows CI

Registry:
• Immutable tags (git sha); never overwrite prod tag
• Retention policy; sign with cosign/notary if policy requires`,
    {
      checklist: [
        "CI builds same Dockerfile as release",
        "No latest tag in production deploy manifest",
        "Base image updated within 30 days of security patch",
      ],
    }
  ),
  sec(
    "prod-limits",
    "6. Production limits & logging",
    `Unlimited container = noisy neighbor on shared nodes.

Resources (Compose deploy section or k8s):
• cpus: '0.5' — requests and limits aligned in k8s
• memory: 512M limit — Node apps: set NODE_OPTIONS=--max-old-space-size=384
• pids_limit prevent fork bombs

Logging:
• json-file driver with max-size 10m max-file 3 — prevents disk fill
• Centralize: fluent-bit / CloudWatch / Loki sidecar in prod orchestrator

Restart policy:
• unless-stopped locally
• on-failure with max attempts in orchestrated env — let platform reschedule

Ulimits:
• nofile 65536 for high-concurrency servers

OOM: memory limit without JVM/Node heap tuning = SIGKILL mid-request — tune runtime flags to 70–80% of cgroup limit.`,
    {
      bullets: [
        "Load test with limits applied — not unlimited docker run",
        "Graceful shutdown: STOPSIGNAL SIGTERM, stop_grace_period 30s",
        "One container one concern — sidecar pattern for log/metric agents",
      ],
    }
  ),
  sec(
    "dev-prod",
    "7. Dev vs prod Dockerfile strategy",
    `Avoid Dockerfile.dev and Dockerfile.prod diverging into different apps.

Options:
• Target flag: docker build --target dev vs runtime
• Compose override: docker-compose.override.yml mounts source for hot reload
• Dev stage installs nodemon; prod stage copies artifacts only

Volume mounts in dev:
• Bind mount source — exclude node_modules with anonymous volume
• Never mount .env with prod secrets into dev container by mistake

CI:
• Build prod target; run unit tests inside image or prior stage
• Smoke: docker run --rm image curl localhost health`,
  ),
  sec(
    "antipatterns",
    "8. Anti-patterns",
    `• docker commit as deploy pipeline
• Running apt-get upgrade in every build (non-reproducible)
• Secrets in ENV baked into image layers
• Root USER because "permission errors were annoying"
• Healthcheck hitting external URL (flaky) instead of localhost
• docker-compose.yml publishing Redis/Postgres to 0.0.0.0 on coffee shop wifi
• :latest in prod k8s manifest
• 2GB "just in case" memory with no limit — hides leaks until host dies
• Installing curl/wget in prod image only for healthcheck — use built-in or minimal probe binary

Good Docker is boring images, explicit health, and limits that match how the app actually runs.`,
  ),
];
