export type DeploymentDifficulty = "beginner" | "intermediate" | "advanced";

export type DeploymentTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: DeploymentDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type DeploymentSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: DeploymentTopicDef[];
};

function t(partial: DeploymentTopicDef): DeploymentTopicDef {
  return partial;
}

export const DEPLOYMENT_ACADEMY_SECTIONS: DeploymentSectionDef[] = [
  {
    "slug": "deployment-basics",
    "title": "Deployment Basics",
    "description": "What deployment means and how releases leave your machine.",
    "topics": [
      {
        "slug": "what-is-deployment",
        "title": "What is Deployment?",
        "summary": "Deployment makes an application available to users on a remote environment.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "deploy",
          "release",
          "hosting"
        ],
        "challengeWeight": 4,
        "explanation": "Deployment moves a built application from local development onto servers or platforms users can reach. It usually includes building artifacts, configuring environment variables, starting processes, and verifying health. Good deployments are repeatable, reversible, and observable.",
        a11yNotes: [],
        "commonMistakes": [
          "Treating deploy as a one-off manual checklist with no rollback plan",
          "Shipping unbuilt source instead of production artifacts",
          "Skipping health checks after release"
        ],
        "bestPractices": [
          "Automate build and release steps",
          "Keep configuration outside source code",
          "Verify the app after every deploy"
        ],
        "interviewQuestions": [
          "What does deployment include besides copying files?",
          "Why should deployments be reversible?",
          "What is a release artifact?"
        ],
        "cheatSheet": [
          {
            "tag": "artifact",
            "desc": "Built package ready to run in production"
          },
          {
            "tag": "release",
            "desc": "A versioned deploy of an artifact"
          },
          {
            "tag": "rollback",
            "desc": "Returning to a previous good release"
          }
        ]
      },
      {
        "slug": "environments",
        "title": "Environments: Dev, Staging, Prod",
        "summary": "Separate environments reduce risk by isolating experiments from live users.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "dev",
          "staging",
          "production"
        ],
        "challengeWeight": 4,
        "explanation": "Development is for local iteration. Staging mirrors production so teams can validate releases safely. Production serves real users and prioritizes stability, security, and observability. Promoting the same artifact through environments is safer than rebuilding differently for each stage.",
        a11yNotes: [],
        "commonMistakes": [
          "Using production data casually in development",
          "Letting staging drift far from production",
          "Hardcoding environment-specific values in source"
        ],
        "bestPractices": [
          "Promote the same build artifact across environments",
          "Keep secrets environment-specific",
          "Make staging as production-like as practical"
        ],
        "interviewQuestions": [
          "Why keep staging close to production?",
          "What should differ between environments?",
          "What is artifact promotion?"
        ],
        "cheatSheet": [
          {
            "tag": "dev",
            "desc": "Local or shared development environment"
          },
          {
            "tag": "staging",
            "desc": "Pre-production validation environment"
          },
          {
            "tag": "prod",
            "desc": "Live user-facing environment"
          }
        ]
      },
      {
        "slug": "build-artifacts",
        "title": "Build Artifacts",
        "summary": "A build artifact is the compiled or packaged output you actually deploy.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "build",
          "artifact",
          "bundle"
        ],
        "challengeWeight": 4,
        "explanation": "Source code is rarely what runs in production. Builds produce artifacts such as Docker images, static bundles, JARs, or tarballs. Versioning artifacts lets you redeploy exactly what was tested. Immutable artifacts reduce surprise differences between staging and production.",
        a11yNotes: [],
        "commonMistakes": [
          "Redeploying from a dirty local workspace",
          "Mutating an already released artifact",
          "Leaving artifacts untagged or overwritten"
        ],
        "bestPractices": [
          "Build once, deploy many times",
          "Tag artifacts with git SHA or semver",
          "Treat released artifacts as immutable"
        ],
        "interviewQuestions": [
          "What is an immutable artifact?",
          "Why tag with a git SHA?",
          "Name common artifact types"
        ],
        "cheatSheet": [
          {
            "tag": "image",
            "desc": "Container image packaged for runtime"
          },
          {
            "tag": "bundle",
            "desc": "Compiled frontend or app package"
          },
          {
            "tag": "tag",
            "desc": "Version label for an artifact"
          }
        ]
      },
      {
        "slug": "config-vs-code",
        "title": "Config vs Code",
        "summary": "Keep environment configuration out of application source when possible.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "config",
          "env",
          "12-factor"
        ],
        "challengeWeight": 4,
        "explanation": "Application behavior often depends on ports, URLs, feature flags, and credentials. The twelve-factor approach stores config in the environment so the same artifact can run everywhere. Code stays constant; config changes per environment. Secrets deserve stricter handling than ordinary config.",
        a11yNotes: [],
        "commonMistakes": [
          "Committing production secrets to git",
          "Rebuilding the app only to change an API URL",
          "Silent defaults that hide missing required config"
        ],
        "bestPractices": [
          "Inject config at runtime",
          "Validate required environment variables on boot",
          "Separate public config from secrets"
        ],
        "interviewQuestions": [
          "Why separate config from code?",
          "What belongs in environment variables?",
          "How should missing required config be handled?"
        ],
        "cheatSheet": [
          {
            "tag": "ENV",
            "desc": "Runtime environment variables"
          },
          {
            "tag": "12-factor",
            "desc": "App design principles including config in the environment"
          },
          {
            "tag": "fail-fast",
            "desc": "Crash early when required config is absent"
          }
        ]
      }
    ]
  },
  {
    "slug": "hosting-platforms",
    "title": "Hosting Platforms",
    "description": "Where apps run: PaaS platforms, DNS, TLS, and health checks.",
    "topics": [
      {
        "slug": "hosting-options",
        "title": "Hosting Options",
        "summary": "Choose hosting based on control, cost, and operational burden.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "hosting",
          "paas",
          "vps"
        ],
        "challengeWeight": 4,
        "explanation": "Hosting options range from fully managed platforms to virtual private servers. Managed platforms handle TLS, scaling hooks, and deploys with less ops work. A VPS gives more control but requires patching, networking, and process supervision. Containers package once and run on many hosts.",
        a11yNotes: [],
        "commonMistakes": [
          "Choosing the most complex option by default",
          "Ignoring operational cost of self-hosting",
          "Assuming managed platforms remove all responsibility"
        ],
        "bestPractices": [
          "Match hosting to team capacity",
          "Start simple and add control when needed",
          "Understand what the platform manages versus what you manage"
        ],
        "interviewQuestions": [
          "Compare PaaS and VPS trade-offs",
          "What does a managed platform typically handle?",
          "When are containers helpful?"
        ],
        "cheatSheet": [
          {
            "tag": "PaaS",
            "desc": "Platform as a Service managed hosting"
          },
          {
            "tag": "VPS",
            "desc": "Virtual private server you administer"
          },
          {
            "tag": "container",
            "desc": "Isolated packaged runtime unit"
          }
        ]
      },
      {
        "slug": "domains-and-dns",
        "title": "Domains and DNS",
        "summary": "DNS maps human-readable domains to infrastructure endpoints.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "dns",
          "domain",
          "a-record"
        ],
        "challengeWeight": 4,
        "explanation": "Users reach apps through domain names resolved by DNS. Common records include A/AAAA for IPs and CNAME for aliases. TTL controls how long resolvers cache answers, which affects cutover speed. During deploys you may point a domain at a load balancer, CDN, or platform hostname.",
        a11yNotes: [],
        "commonMistakes": [
          "Lowering TTL only after a risky cutover",
          "Pointing apex domains incorrectly without provider support",
          "Forgetting HTTPS after changing DNS"
        ],
        "bestPractices": [
          "Lower TTL ahead of planned migrations",
          "Verify records with dig or similar tools",
          "Keep HTTPS certificates valid across cutovers"
        ],
        "interviewQuestions": [
          "What does TTL affect?",
          "Difference between A and CNAME?",
          "Why plan DNS before a cutover?"
        ],
        "cheatSheet": [
          {
            "tag": "A record",
            "desc": "Maps a name to an IPv4 address"
          },
          {
            "tag": "CNAME",
            "desc": "Alias from one name to another"
          },
          {
            "tag": "TTL",
            "desc": "How long DNS answers may be cached"
          }
        ]
      },
      {
        "slug": "https-and-tls",
        "title": "HTTPS and TLS",
        "summary": "TLS encrypts traffic between clients and your deployed service.",
        "estimatedMinutes": 14,
        "difficulty": "beginner",
        "keywords": [
          "https",
          "tls",
          "certificate"
        ],
        "challengeWeight": 4,
        "explanation": "HTTPS uses TLS certificates to encrypt connections and help clients verify server identity. Certificates are issued by certificate authorities and must be renewed before expiry. Many platforms provision certificates automatically. On a VPS you may terminate TLS at Nginx or Caddy.",
        a11yNotes: [],
        "commonMistakes": [
          "Serving production traffic over plain HTTP",
          "Letting certificates expire unnoticed",
          "Sharing private keys in chat or git"
        ],
        "bestPractices": [
          "Automate certificate issuance and renewal",
          "Terminate TLS at a trusted reverse proxy or platform edge",
          "Monitor certificate expiry"
        ],
        "interviewQuestions": [
          "What does TLS protect?",
          "Where can TLS be terminated?",
          "What happens when a certificate expires?"
        ],
        "cheatSheet": [
          {
            "tag": "TLS",
            "desc": "Transport Layer Security encryption"
          },
          {
            "tag": "certificate",
            "desc": "Credential proving server identity for HTTPS"
          },
          {
            "tag": "SNI",
            "desc": "Server Name Indication for hosting multiple certs"
          }
        ]
      },
      {
        "slug": "health-checks",
        "title": "Health Checks",
        "summary": "Health endpoints tell load balancers whether an instance can receive traffic.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "health",
          "readiness",
          "liveness"
        ],
        "challengeWeight": 4,
        "explanation": "Health checks distinguish live processes from ready ones. A liveness check asks whether the process should be restarted. A readiness check asks whether it should receive traffic. Good checks verify critical dependencies carefully without causing cascading failures.",
        a11yNotes: [],
        "commonMistakes": [
          "Making health checks so heavy they overload dependencies",
          "Returning ready before migrations finish",
          "Using the same check for liveness and readiness blindly"
        ],
        "bestPractices": [
          "Keep checks cheap and clear",
          "Separate readiness from liveness when needed",
          "Fail readiness until the app can serve correctly"
        ],
        "interviewQuestions": [
          "Liveness vs readiness?",
          "Why do deploys need health checks?",
          "What should a health endpoint verify?"
        ],
        "cheatSheet": [
          {
            "tag": "/health",
            "desc": "Common health endpoint path"
          },
          {
            "tag": "readiness",
            "desc": "Ready to accept traffic"
          },
          {
            "tag": "liveness",
            "desc": "Process is alive and should not restart"
          }
        ]
      }
    ]
  },
  {
    "slug": "containers",
    "title": "Containers",
    "description": "Docker images, containers, Dockerfiles, and compose.",
    "topics": [
      {
        "slug": "docker-basics",
        "title": "Docker Basics",
        "summary": "Containers package an app with its runtime dependencies for consistent execution.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "docker",
          "container",
          "image"
        ],
        "challengeWeight": 4,
        "explanation": "Docker images are immutable snapshots. Containers are running instances of images. Packaging an app as an image reduces environment drift between developer machines and servers. Images are built in layers and stored in registries.",
        a11yNotes: [],
        "commonMistakes": [
          "Editing a running container and forgetting to rebuild the image",
          "Confusing images with containers",
          "Running containers as root without necessity"
        ],
        "bestPractices": [
          "Build images from Dockerfiles",
          "Tag images clearly",
          "Prefer immutable infrastructure over snowflake containers"
        ],
        "interviewQuestions": [
          "Image vs container?",
          "Why use containers for deployment?",
          "Where are images stored?"
        ],
        "cheatSheet": [
          {
            "tag": "image",
            "desc": "Immutable packaged filesystem and metadata"
          },
          {
            "tag": "container",
            "desc": "Running instance of an image"
          },
          {
            "tag": "registry",
            "desc": "Storage and distribution for images"
          }
        ]
      },
      {
        "slug": "dockerfile-fundamentals",
        "title": "Dockerfile Fundamentals",
        "summary": "A Dockerfile declares how to build a reproducible image.",
        "estimatedMinutes": 14,
        "difficulty": "beginner",
        "keywords": [
          "dockerfile",
          "from",
          "copy"
        ],
        "challengeWeight": 5,
        "explanation": "Dockerfiles start FROM a base image, then COPY files, RUN build steps, set ENV, EXPOSE ports, and define CMD or ENTRYPOINT. Order matters because each instruction creates a cacheable layer. Keep images small, avoid secrets in layers, and use .dockerignore.",
        a11yNotes: [],
        "commonMistakes": [
          "Copying secrets into image layers",
          "Using latest tags without pinning",
          "Putting all files into the image without a .dockerignore"
        ],
        "bestPractices": [
          "Pin base image versions",
          "Use multi-stage builds for compiled apps",
          "Order instructions for better cache hits"
        ],
        "interviewQuestions": [
          "What does FROM do?",
          "Why pin image tags?",
          "What is a multi-stage build?"
        ],
        "cheatSheet": [
          {
            "tag": "FROM",
            "desc": "Base image for the build"
          },
          {
            "tag": "COPY",
            "desc": "Add files into the image"
          },
          {
            "tag": "CMD",
            "desc": "Default process to run in the container"
          }
        ]
      },
      {
        "slug": "images-vs-containers",
        "title": "Images vs Containers",
        "summary": "Images are blueprints; containers are running processes created from those blueprints.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "image",
          "container",
          "runtime"
        ],
        "challengeWeight": 3,
        "explanation": "An image does not change when a container runs. Changes inside a container are ephemeral unless volumes or new image commits are used. Production practice is to rebuild images for changes rather than patching live containers.",
        a11yNotes: [],
        "commonMistakes": [
          "Relying on manual changes inside production containers",
          "Expecting container filesystem changes to persist by default",
          "Assuming one container equals one image forever"
        ],
        "bestPractices": [
          "Rebuild and redeploy for durable changes",
          "Use volumes for persistent data",
          "Configure containers with env and mounts"
        ],
        "interviewQuestions": [
          "Do container changes update the image?",
          "How do you persist data?",
          "Can many containers share one image?"
        ],
        "cheatSheet": [
          {
            "tag": "ephemeral",
            "desc": "Container filesystem changes disappear when removed"
          },
          {
            "tag": "volume",
            "desc": "Persistent storage mounted into containers"
          },
          {
            "tag": "instance",
            "desc": "A specific running container"
          }
        ]
      },
      {
        "slug": "dockerignore",
        "title": "dockerignore",
        "summary": "Exclude files from the build context to keep images clean and builds fast.",
        "estimatedMinutes": 8,
        "difficulty": "beginner",
        "keywords": [
          "dockerignore",
          "context",
          "build"
        ],
        "challengeWeight": 3,
        "explanation": "docker build sends a context directory to the daemon. Without .dockerignore you may include node_modules, .git, secrets, and huge caches. That slows builds and can leak sensitive files into layers.",
        a11yNotes: [],
        "commonMistakes": [
          "Forgetting to ignore .env files",
          "Shipping local node_modules into Linux images unintentionally",
          "Ignoring nothing and uploading gigabytes of context"
        ],
        "bestPractices": [
          "Maintain a .dockerignore like .gitignore for builds",
          "Never include secrets in build context if avoidable",
          "Keep context minimal"
        ],
        "interviewQuestions": [
          "What is build context?",
          "Why ignore .git?",
          "What risk does including .env create?"
        ],
        "cheatSheet": [
          {
            "tag": ".dockerignore",
            "desc": "Patterns excluded from Docker build context"
          },
          {
            "tag": "context",
            "desc": "Files sent to Docker for the build"
          },
          {
            "tag": "layer",
            "desc": "Cached filesystem diff from a Dockerfile step"
          }
        ]
      },
      {
        "slug": "compose-basics",
        "title": "Compose Basics",
        "summary": "Docker Compose runs multi-container apps with one declarative file.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "compose",
          "services",
          "yaml"
        ],
        "challengeWeight": 4,
        "explanation": "Compose YAML defines services, networks, volumes, ports, and env files. It is excellent for local stacks: app, database, cache, and workers together. Compose can also help small deployments, though orchestrators often take over at scale.",
        a11yNotes: [],
        "commonMistakes": [
          "Using Compose as the only strategy for large production fleets without considering orchestration needs",
          "Hardcoding secrets in compose files",
          "Publishing unnecessary ports"
        ],
        "bestPractices": [
          "Define one service per process",
          "Use env files carefully",
          "Document how to bring the stack up and down"
        ],
        "interviewQuestions": [
          "What does a Compose service represent?",
          "When is Compose most useful?",
          "How are ports published?"
        ],
        "cheatSheet": [
          {
            "tag": "services",
            "desc": "Containers defined in compose.yml"
          },
          {
            "tag": "ports",
            "desc": "Host to container port mappings"
          },
          {
            "tag": "volumes",
            "desc": "Named or bind mounts for persistence"
          }
        ]
      },
      {
        "slug": "docker-registries",
        "title": "Docker Registries",
        "summary": "Registries store and distribute container images for deploys.",
        "estimatedMinutes": 10,
        "difficulty": "intermediate",
        "keywords": [
          "registry",
          "push",
          "pull"
        ],
        "challengeWeight": 4,
        "explanation": "After building an image you push it to a registry such as Docker Hub, GHCR, or ECR. Deploy environments pull that tagged image. Access control and vulnerability scanning matter in production registries. Prefer immutable tags over overwriting latest for releases.",
        a11yNotes: [],
        "commonMistakes": [
          "Overwriting latest without retaining digests",
          "Publicly pushing private application images",
          "No authentication on private registries"
        ],
        "bestPractices": [
          "Push immutable release tags",
          "Restrict who can push production images",
          "Scan images for known vulnerabilities"
        ],
        "interviewQuestions": [
          "What is a container registry?",
          "Why avoid mutable latest for releases?",
          "Name common registries"
        ],
        "cheatSheet": [
          {
            "tag": "push",
            "desc": "Upload an image to a registry"
          },
          {
            "tag": "pull",
            "desc": "Download an image for running"
          },
          {
            "tag": "digest",
            "desc": "Content-addressed image identifier"
          }
        ]
      }
    ]
  },
  {
    "slug": "process-and-proxy",
    "title": "Processes and Proxies",
    "description": "Keep apps running and route traffic through reverse proxies.",
    "topics": [
      {
        "slug": "process-managers",
        "title": "Process Managers",
        "summary": "Process managers restart and supervise application processes on a host.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "systemd",
          "pm2",
          "process"
        ],
        "challengeWeight": 4,
        "explanation": "On a VPS, process managers like systemd keep your service running after reboot and restart it on failure. They capture logs, manage environment files, and define dependencies. A bare process started over SSH will die when the session ends without a supervisor.",
        a11yNotes: [],
        "commonMistakes": [
          "Starting production apps in an interactive SSH session",
          "No restart policy on failure",
          "Ignoring logs from the supervisor"
        ],
        "bestPractices": [
          "Use systemd or an orchestrator for long-running services",
          "Enable restart on failure",
          "Ship logs to a durable location"
        ],
        "interviewQuestions": [
          "Why not run the app directly in SSH?",
          "What does a restart policy do?",
          "Name a common Linux process manager"
        ],
        "cheatSheet": [
          {
            "tag": "systemd",
            "desc": "Linux service manager and init system"
          },
          {
            "tag": "restart",
            "desc": "Automatic relaunch after crash"
          },
          {
            "tag": "unit file",
            "desc": "systemd service definition"
          }
        ]
      },
      {
        "slug": "reverse-proxy",
        "title": "Reverse Proxy Basics",
        "summary": "A reverse proxy terminates client connections and forwards to upstream apps.",
        "estimatedMinutes": 14,
        "difficulty": "intermediate",
        "keywords": [
          "nginx",
          "proxy",
          "upstream"
        ],
        "challengeWeight": 4,
        "explanation": "Nginx, Caddy, and cloud load balancers often sit in front of app processes. They handle TLS, compression, static files, and routing to multiple upstreams. The app can listen on localhost while the proxy listens on 443.",
        a11yNotes: [],
        "commonMistakes": [
          "Exposing the app port publicly when a proxy already fronts it",
          "Misconfiguring upstream timeouts",
          "Forgetting WebSocket or header forwarding needs"
        ],
        "bestPractices": [
          "Terminate TLS at the proxy when appropriate",
          "Forward required headers like X-Forwarded-For",
          "Keep upstreams on a private network"
        ],
        "interviewQuestions": [
          "What problems does a reverse proxy solve?",
          "Where should TLS terminate?",
          "What is an upstream?"
        ],
        "cheatSheet": [
          {
            "tag": "nginx",
            "desc": "Popular reverse proxy and web server"
          },
          {
            "tag": "upstream",
            "desc": "Backend server receiving proxied requests"
          },
          {
            "tag": "X-Forwarded-For",
            "desc": "Header identifying original client IP"
          }
        ]
      },
      {
        "slug": "zero-downtime",
        "title": "Zero-Downtime Deploys",
        "summary": "Ship new versions without dropping all in-flight user traffic.",
        "estimatedMinutes": 14,
        "difficulty": "intermediate",
        "keywords": [
          "zero-downtime",
          "drain",
          "rolling"
        ],
        "challengeWeight": 5,
        "explanation": "Zero-downtime strategies keep serving requests while replacing instances. Rolling deploys update a subset at a time. Blue-green switches traffic from old to new after validation. Connection draining lets old instances finish requests before shutdown.",
        a11yNotes: [],
        "commonMistakes": [
          "Stopping all old instances before new ones are ready",
          "Incompatible schema changes mid-rollout",
          "No draining of in-flight requests"
        ],
        "bestPractices": [
          "Use rolling or blue-green strategies",
          "Drain connections before killing instances",
          "Make migrations expand/contract compatible"
        ],
        "interviewQuestions": [
          "What is connection draining?",
          "Blue-green vs rolling?",
          "Why can migrations break zero downtime?"
        ],
        "cheatSheet": [
          {
            "tag": "rolling",
            "desc": "Gradually replace instances"
          },
          {
            "tag": "blue-green",
            "desc": "Switch traffic between two environments"
          },
          {
            "tag": "drain",
            "desc": "Finish existing requests before shutdown"
          }
        ]
      },
      {
        "slug": "rollbacks",
        "title": "Rollbacks",
        "summary": "A rollback restores the previous known-good release quickly.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "rollback",
          "release",
          "revert"
        ],
        "challengeWeight": 4,
        "explanation": "Every deploy plan needs a rollback path. With immutable artifacts you redeploy the previous image or bundle. Database migrations complicate rollbacks and may need expand/contract techniques. Feature flags can reduce the need for full code rollback.",
        a11yNotes: [],
        "commonMistakes": [
          "No previous artifact retained",
          "Irreversible migrations without a forward fix plan",
          "Untested rollback scripts"
        ],
        "bestPractices": [
          "Keep N previous releases available",
          "Prefer backward-compatible migrations",
          "Rehearse rollback steps"
        ],
        "interviewQuestions": [
          "How do immutable artifacts help rollbacks?",
          "Why are migrations risky for rollback?",
          "When do feature flags help?"
        ],
        "cheatSheet": [
          {
            "tag": "previous release",
            "desc": "Last known good artifact"
          },
          {
            "tag": "forward fix",
            "desc": "Ship a new fix instead of rolling back"
          },
          {
            "tag": "feature flag",
            "desc": "Toggle behavior without redeploying code"
          }
        ]
      },
      {
        "slug": "blue-green",
        "title": "Blue-Green Deploys",
        "summary": "Blue-green keeps two environments and switches traffic after validation.",
        "estimatedMinutes": 12,
        "difficulty": "advanced",
        "keywords": [
          "blue-green",
          "cutover",
          "idle"
        ],
        "challengeWeight": 4,
        "explanation": "In blue-green deployment, one environment serves traffic while the other is idle or staging the next release. After smoke tests pass, traffic switches. Rollback is often a DNS or load balancer flip back. Cost is higher because capacity is duplicated during the transition.",
        a11yNotes: [],
        "commonMistakes": [
          "Switching before smoke tests pass",
          "Shared mutable state that breaks the idle environment",
          "No quick switch-back path"
        ],
        "bestPractices": [
          "Validate green fully before cutover",
          "Keep blue ready for instant rollback",
          "Watch metrics during and after the switch"
        ],
        "interviewQuestions": [
          "What is blue-green?",
          "How do you roll back?",
          "What is the main cost trade-off?"
        ],
        "cheatSheet": [
          {
            "tag": "blue",
            "desc": "Currently live environment"
          },
          {
            "tag": "green",
            "desc": "Candidate environment for the new release"
          },
          {
            "tag": "cutover",
            "desc": "Moment traffic switches environments"
          }
        ]
      }
    ]
  },
  {
    "slug": "runtime-config",
    "title": "Runtime Configuration",
    "description": "Ports, resources, env files, and start commands.",
    "topics": [
      {
        "slug": "ports-and-binding",
        "title": "Ports and Binding",
        "summary": "Apps must listen on the right interface and port for the platform.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "port",
          "bind",
          "0.0.0.0"
        ],
        "challengeWeight": 3,
        "explanation": "Containers and platforms often expect processes to listen on 0.0.0.0 and a provided PORT variable. Binding only to 127.0.0.1 inside a container makes the service unreachable from the network. Proxies forward external 443 to internal ports.",
        a11yNotes: [],
        "commonMistakes": [
          "Binding to localhost inside Docker unintentionally",
          "Hardcoding port 3000 when the platform sets PORT",
          "Leaving debug ports exposed"
        ],
        "bestPractices": [
          "Honor the PORT environment variable",
          "Bind to 0.0.0.0 in containers",
          "Expose only required ports"
        ],
        "interviewQuestions": [
          "Why bind 0.0.0.0 in containers?",
          "What is PORT injection?",
          "How do proxies use internal ports?"
        ],
        "cheatSheet": [
          {
            "tag": "PORT",
            "desc": "Platform-provided listen port"
          },
          {
            "tag": "0.0.0.0",
            "desc": "Listen on all interfaces"
          },
          {
            "tag": "EXPOSE",
            "desc": "Dockerfile documentation of container ports"
          }
        ]
      },
      {
        "slug": "env-files",
        "title": "Env Files",
        "summary": "Env files provide runtime configuration without rebuilding artifacts.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "env",
          "dotenv",
          "config"
        ],
        "challengeWeight": 3,
        "explanation": ".env files are convenient for local development but must not be committed with secrets. Platforms usually inject env vars in the dashboard or secret store. Document required keys and provide .env.example without sensitive values.",
        a11yNotes: [],
        "commonMistakes": [
          "Committing .env with production secrets",
          "Different undocumented keys per environment",
          "Assuming dotenv works the same in every runtime"
        ],
        "bestPractices": [
          "Commit .env.example only",
          "Inject production secrets via the platform",
          "Document required variables"
        ],
        "interviewQuestions": [
          "Should .env be committed?",
          "What is .env.example for?",
          "How do platforms inject env?"
        ],
        "cheatSheet": [
          {
            "tag": ".env",
            "desc": "Local environment variable file"
          },
          {
            "tag": ".env.example",
            "desc": "Safe template of required keys"
          },
          {
            "tag": "inject",
            "desc": "Provide variables at process start"
          }
        ]
      },
      {
        "slug": "app-start-commands",
        "title": "App Start Commands",
        "summary": "Start commands tell platforms and containers how to launch your process.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "start",
          "cmd",
          "entrypoint"
        ],
        "challengeWeight": 3,
        "explanation": "PaaS platforms and Docker images need an explicit start command such as node server.js or npm start. Prefer production start scripts that do not run file watchers. Distinguish build commands from start commands clearly in docs and platform settings.",
        a11yNotes: [],
        "commonMistakes": [
          "Using a dev watcher as the production start command",
          "Missing start command so the container exits",
          "Running migrations only manually outside the release path"
        ],
        "bestPractices": [
          "Define a production start script",
          "Separate build and start",
          "Fail clearly if the process cannot bind"
        ],
        "interviewQuestions": [
          "Build vs start command?",
          "Why avoid watch mode in production?",
          "What happens if CMD is missing?"
        ],
        "cheatSheet": [
          {
            "tag": "CMD",
            "desc": "Default container start command"
          },
          {
            "tag": "ENTRYPOINT",
            "desc": "Fixed executable wrapper for a container"
          },
          {
            "tag": "start script",
            "desc": "package.json or platform launch command"
          }
        ]
      },
      {
        "slug": "resource-limits",
        "title": "Resource Limits",
        "summary": "CPU and memory limits protect hosts from runaway processes.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "memory",
          "cpu",
          "limits"
        ],
        "challengeWeight": 4,
        "explanation": "Production runtimes set memory and CPU constraints. Exceeding memory often kills the process. Limits also improve noisy-neighbor behavior on shared hosts. Size limits from realistic load tests and watch OOM events after deploys.",
        a11yNotes: [],
        "commonMistakes": [
          "No memory limit on memory-hungry services",
          "Setting limits far below real needs",
          "Ignoring OOM kills"
        ],
        "bestPractices": [
          "Set explicit memory limits",
          "Load test before lowering resources",
          "Alert on restart loops"
        ],
        "interviewQuestions": [
          "What happens on OOM?",
          "Why set CPU limits?",
          "How do you choose memory size?"
        ],
        "cheatSheet": [
          {
            "tag": "OOM",
            "desc": "Out of memory kill"
          },
          {
            "tag": "CPU limit",
            "desc": "Caps compute available to a process"
          },
          {
            "tag": "restart loop",
            "desc": "Crash and relaunch repeatedly"
          }
        ]
      },
      {
        "slug": "immutable-infra",
        "title": "Immutable Infrastructure",
        "summary": "Replace instances instead of mutating servers by hand.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "immutable",
          "cattle",
          "pets"
        ],
        "challengeWeight": 4,
        "explanation": "Immutable infrastructure treats servers like cattle, not pets: bake a new image or config and roll forward rather than SSHing to patch live nodes. This improves reproducibility and auditability. Manual hotfixes should be rare and followed by a proper release.",
        a11yNotes: [],
        "commonMistakes": [
          "Long-lived unique servers with undocumented changes",
          "Hotfix only in production",
          "No image rebuild after emergency change"
        ],
        "bestPractices": [
          "Bake changes into new artifacts",
          "Recreate instances from known images",
          "Limit direct production SSH"
        ],
        "interviewQuestions": [
          "Cattle vs pets?",
          "Why avoid unique snowflake servers?",
          "How do emergency hotfixes get formalized?"
        ],
        "cheatSheet": [
          {
            "tag": "bake",
            "desc": "Build changes into an image/artifact"
          },
          {
            "tag": "recreate",
            "desc": "Replace instance from scratch"
          },
          {
            "tag": "drift",
            "desc": "Manual changes diverging from source"
          }
        ]
      }
    ]
  },
  {
    "slug": "release-operations",
    "title": "Release Operations",
    "description": "Secrets, logging, checklists, platforms, and VPS deploys.",
    "topics": [
      {
        "slug": "secrets-in-deploy",
        "title": "Secrets in Deployment",
        "summary": "Inject secrets at runtime; never bake them into images or repos.",
        "estimatedMinutes": 14,
        "difficulty": "intermediate",
        "keywords": [
          "secrets",
          "env",
          "vault"
        ],
        "challengeWeight": 5,
        "explanation": "API keys, database passwords, and private certificates must stay out of source control and image layers. Use platform secret stores or vault systems. Rotate credentials and scope them tightly. Leakage often happens through build logs and debug endpoints as well as git history.",
        a11yNotes: [],
        "commonMistakes": [
          "COPY .env into a Dockerfile",
          "Printing secrets in CI logs",
          "Sharing prod credentials in chat"
        ],
        "bestPractices": [
          "Inject secrets at runtime",
          "Rotate and least-privilege credentials",
          "Redact secrets from logs"
        ],
        "interviewQuestions": [
          "Why not put secrets in images?",
          "How should apps receive secrets?",
          "What is least privilege for credentials?"
        ],
        "cheatSheet": [
          {
            "tag": "secret store",
            "desc": "Managed storage for sensitive values"
          },
          {
            "tag": "runtime inject",
            "desc": "Provide secrets when the process starts"
          },
          {
            "tag": "rotation",
            "desc": "Periodically replace credentials"
          }
        ]
      },
      {
        "slug": "logging-for-deploys",
        "title": "Logging for Deploys",
        "summary": "Deploy-time logs prove what started, failed, or became healthy.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "logs",
          "stdout",
          "observability"
        ],
        "challengeWeight": 4,
        "explanation": "During releases, logs confirm boot, migrations, and errors. Containers should log to stdout/stderr for aggregation. Correlate deploys with spikes in errors and latency. Structured logs help query by release version.",
        a11yNotes: [],
        "commonMistakes": [
          "Logging only to local files inside ephemeral containers",
          "No version field in log lines",
          "Ignoring error spikes after deploy"
        ],
        "bestPractices": [
          "Log to stdout for collection",
          "Include release identifiers",
          "Watch error rates after each deploy"
        ],
        "interviewQuestions": [
          "Where should containers write logs?",
          "How do you correlate logs to a release?",
          "What signals suggest a bad deploy?"
        ],
        "cheatSheet": [
          {
            "tag": "stdout",
            "desc": "Standard output stream for container logs"
          },
          {
            "tag": "structured log",
            "desc": "JSON or key-value logs for querying"
          },
          {
            "tag": "release id",
            "desc": "Version tag included in telemetry"
          }
        ]
      },
      {
        "slug": "release-checklist",
        "title": "Release Checklist",
        "summary": "A checklist reduces missed steps under pressure.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "checklist",
          "release",
          "runbook"
        ],
        "challengeWeight": 3,
        "explanation": "Release checklists capture migrations, feature flags, DNS, smoke tests, and rollback owners. They turn tribal knowledge into a repeatable process. Keep checklists short and actionable. Automate whatever you can.",
        a11yNotes: [],
        "commonMistakes": [
          "Improvising production releases from memory",
          "Checklists so long nobody uses them",
          "No named owner for rollback"
        ],
        "bestPractices": [
          "Write a short release runbook",
          "Assign deploy and rollback owners",
          "Automate verification commands"
        ],
        "interviewQuestions": [
          "What belongs on a release checklist?",
          "Why name a rollback owner?",
          "What should be automated?"
        ],
        "cheatSheet": [
          {
            "tag": "runbook",
            "desc": "Documented operational procedure"
          },
          {
            "tag": "smoke test",
            "desc": "Quick post-deploy sanity checks"
          },
          {
            "tag": "owner",
            "desc": "Person accountable for the step"
          }
        ]
      },
      {
        "slug": "platform-deploys",
        "title": "Platform Deploys",
        "summary": "PaaS workflows deploy from git with platform-managed infrastructure.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "vercel",
          "render",
          "railway",
          "paas"
        ],
        "challengeWeight": 4,
        "explanation": "Platforms like Vercel, Render, and Railway connect to your repository, build on push, set env vars, and provide HTTPS hostnames. You still own migrations, secrets hygiene, and observability. Preview environments help review changes before production.",
        a11yNotes: [],
        "commonMistakes": [
          "Assuming the platform replaces the need for health checks and logs",
          "Mixing prod and preview secrets",
          "No idea how to roll back on the platform"
        ],
        "bestPractices": [
          "Learn platform rollback and promote flows",
          "Separate preview and production config",
          "Monitor platform metrics after release"
        ],
        "interviewQuestions": [
          "What does a PaaS typically automate?",
          "Why separate preview secrets?",
          "How do you roll back on a platform?"
        ],
        "cheatSheet": [
          {
            "tag": "build command",
            "desc": "How the platform compiles your app"
          },
          {
            "tag": "start command",
            "desc": "How the platform launches the process"
          },
          {
            "tag": "preview env",
            "desc": "Temporary environment for a pull request"
          }
        ]
      },
      {
        "slug": "vps-deploys",
        "title": "VPS Deploys",
        "summary": "A VPS deploy needs SSH, process supervision, networking, and updates.",
        "estimatedMinutes": 14,
        "difficulty": "intermediate",
        "keywords": [
          "vps",
          "ssh",
          "linux"
        ],
        "challengeWeight": 4,
        "explanation": "Self-hosting on a VPS means you install runtimes or Docker, open ports carefully, configure a reverse proxy, and supervise processes. Security patching and backups are your responsibility. Start with SSH keys, firewall rules, and documented bootstrap steps.",
        a11yNotes: [],
        "commonMistakes": [
          "Password SSH on the open internet",
          "No firewall",
          "No backup for server config and data"
        ],
        "bestPractices": [
          "Use SSH keys and disable password login",
          "Configure a firewall",
          "Automate provisioning where possible"
        ],
        "interviewQuestions": [
          "What are the main responsibilities on a VPS?",
          "How should SSH be secured?",
          "Why document bootstrap?"
        ],
        "cheatSheet": [
          {
            "tag": "SSH",
            "desc": "Secure remote shell access"
          },
          {
            "tag": "firewall",
            "desc": "Controls allowed inbound ports"
          },
          {
            "tag": "provision",
            "desc": "Create and configure the server"
          }
        ]
      }
    ]
  },
  {
    "slug": "shipping-safely",
    "title": "Shipping Safely",
    "description": "Migration safety, canaries, smoke tests, and production readiness.",
    "topics": [
      {
        "slug": "migration-safety",
        "title": "Migration Safety",
        "summary": "Schema changes must stay compatible with running app versions during rollout.",
        "estimatedMinutes": 14,
        "difficulty": "advanced",
        "keywords": [
          "migration",
          "expand-contract",
          "compat"
        ],
        "challengeWeight": 5,
        "explanation": "During rolling deploys, old and new application versions may run together. Migrations should expand first before code depends on them, then contract later. Avoid destructive changes in the same release that deploys incompatible code.",
        a11yNotes: [],
        "commonMistakes": [
          "Dropping a column in the same deploy that still reads it",
          "Untested long locks on big tables",
          "No backward-compatible transition"
        ],
        "bestPractices": [
          "Use expand/contract migrations",
          "Test migration time and locks",
          "Coordinate app and schema versions"
        ],
        "interviewQuestions": [
          "What is expand/contract?",
          "Why are mixed versions a problem?",
          "How do you test migrations?"
        ],
        "cheatSheet": [
          {
            "tag": "expand",
            "desc": "Additive compatible schema change"
          },
          {
            "tag": "contract",
            "desc": "Later removal after code no longer needs it"
          },
          {
            "tag": "lock",
            "desc": "Database lock that can stall traffic"
          }
        ]
      },
      {
        "slug": "canary-basics",
        "title": "Canary Basics",
        "summary": "Canaries expose a new version to a small slice of traffic first.",
        "estimatedMinutes": 12,
        "difficulty": "advanced",
        "keywords": [
          "canary",
          "traffic",
          "risk"
        ],
        "challengeWeight": 4,
        "explanation": "Canary releases reduce blast radius by sending a percentage of traffic to the new version while monitoring errors and latency. If metrics degrade, traffic shifts back. Canaries need good observability and comparable traffic.",
        a11yNotes: [],
        "commonMistakes": [
          "Canary without metrics",
          "Non-representative canary traffic",
          "No automatic abort conditions"
        ],
        "bestPractices": [
          "Define abort thresholds",
          "Compare canary and baseline metrics",
          "Start with a small traffic percentage"
        ],
        "interviewQuestions": [
          "What is a canary release?",
          "What metrics matter?",
          "When do you abort?"
        ],
        "cheatSheet": [
          {
            "tag": "canary",
            "desc": "Small traffic slice on new version"
          },
          {
            "tag": "baseline",
            "desc": "Stable version for comparison"
          },
          {
            "tag": "abort",
            "desc": "Stop rollout on bad signals"
          }
        ]
      },
      {
        "slug": "smoke-tests",
        "title": "Smoke Tests",
        "summary": "Smoke tests quickly verify critical paths after a release.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "smoke",
          "verify",
          "post-deploy"
        ],
        "challengeWeight": 3,
        "explanation": "After deploying, hit health endpoints and a few critical user journeys. Smoke tests are shallow but fast. Automate them in the pipeline when possible. They catch missing env vars, bad routes, and crashed processes.",
        a11yNotes: [],
        "commonMistakes": [
          "Declaring victory when the process starts but routes 500",
          "No smoke tests for login or checkout",
          "Only testing locally"
        ],
        "bestPractices": [
          "Automate post-deploy smoke checks",
          "Cover the top critical paths",
          "Fail the release on smoke failure"
        ],
        "interviewQuestions": [
          "What makes a good smoke test?",
          "When should smoke tests run?",
          "What failures do they catch?"
        ],
        "cheatSheet": [
          {
            "tag": "smoke",
            "desc": "Fast critical-path verification"
          },
          {
            "tag": "critical path",
            "desc": "Most important user journey"
          },
          {
            "tag": "post-deploy",
            "desc": "Runs after release completes"
          }
        ]
      },
      {
        "slug": "observability-signals",
        "title": "Observability Signals",
        "summary": "Metrics, logs, and traces tell you if a deploy is healthy.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "metrics",
          "traces",
          "alerts"
        ],
        "challengeWeight": 4,
        "explanation": "Watch error rate, latency, saturation, and key business metrics during and after deploys. Annotate graphs with deploy markers. Observability turns rollback from opinion into evidence.",
        a11yNotes: [],
        "commonMistakes": [
          "No deploy markers on dashboards",
          "Alerting only on CPU while users see errors",
          "No baseline for comparison"
        ],
        "bestPractices": [
          "Annotate deploys on charts",
          "Alert on user-facing symptoms",
          "Compare against pre-deploy baseline"
        ],
        "interviewQuestions": [
          "Which golden signals matter after deploy?",
          "Why annotate deploys?",
          "What is a baseline?"
        ],
        "cheatSheet": [
          {
            "tag": "error rate",
            "desc": "Percentage of failed requests"
          },
          {
            "tag": "latency",
            "desc": "Response time distribution"
          },
          {
            "tag": "deploy marker",
            "desc": "Annotation showing when a release happened"
          }
        ]
      },
      {
        "slug": "production-readiness",
        "title": "Production Readiness",
        "summary": "A readiness review asks if the service is safe to expose to real users.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "readiness",
          "checklist",
          "prod"
        ],
        "challengeWeight": 4,
        "explanation": "Production readiness covers health checks, metrics, logs, backups, secrets, resource limits, and on-call ownership. It is a quality gate before the first production launch and before major redesigns. Document how to deploy, roll back, and debug.",
        a11yNotes: [],
        "commonMistakes": [
          "Launching without an owner",
          "No backup or restore test",
          "Missing dashboards for key metrics"
        ],
        "bestPractices": [
          "Complete a readiness checklist",
          "Name an on-call owner",
          "Test restore and rollback"
        ],
        "interviewQuestions": [
          "What is production readiness?",
          "Name five readiness items",
          "Why test restores?"
        ],
        "cheatSheet": [
          {
            "tag": "on-call",
            "desc": "Person responding to production incidents"
          },
          {
            "tag": "restore test",
            "desc": "Verify backups actually recover data"
          },
          {
            "tag": "readiness review",
            "desc": "Gate before production exposure"
          }
        ]
      }
    ]
  }
];

export function flattenDeploymentTopics(): DeploymentTopicDef[] {
  return DEPLOYMENT_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
