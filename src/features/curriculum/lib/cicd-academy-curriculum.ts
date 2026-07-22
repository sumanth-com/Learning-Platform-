export type CicdDifficulty = "beginner" | "intermediate" | "advanced";

export type CicdTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: CicdDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type CicdSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: CicdTopicDef[];
};

function t(partial: CicdTopicDef): CicdTopicDef {
  return partial;
}

export const CICD_ACADEMY_SECTIONS: CicdSectionDef[] = [
  {
    "slug": "cicd-intro",
    "title": "CI/CD Introduction",
    "description": "Continuous integration and delivery concepts.",
    "topics": [
      {
        "slug": "what-is-ci",
        "title": "What is CI?",
        "summary": "Continuous Integration frequently merges and verifies code changes automatically.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "ci",
          "integration",
          "automation"
        ],
        "challengeWeight": 4,
        "explanation": "Continuous Integration (CI) means developers merge changes often and each change runs automated checks. Typical checks include install, lint, unit tests, and build. CI catches breakages early while they are cheap to fix. The output of CI is confidence that the branch still works.",
        a11yNotes: [],
        "commonMistakes": [
          "Merging rarely and testing only locally",
          "Ignoring failed CI because it is flaky",
          "Skipping CI for 'small' changes"
        ],
        "bestPractices": [
          "Run CI on every pull request",
          "Keep the main branch green",
          "Fix or quarantine flaky tests quickly"
        ],
        "interviewQuestions": [
          "What problem does CI solve?",
          "What usually runs in CI?",
          "Why keep main green?"
        ],
        "cheatSheet": [
          {
            "tag": "CI",
            "desc": "Continuous Integration"
          },
          {
            "tag": "pipeline",
            "desc": "Automated sequence of checks"
          },
          {
            "tag": "green build",
            "desc": "All required checks passed"
          }
        ]
      },
      {
        "slug": "what-is-cd",
        "title": "What is CD?",
        "summary": "Continuous Delivery or Deployment automates releasing verified changes.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "cd",
          "delivery",
          "deploy"
        ],
        "challengeWeight": 4,
        "explanation": "Continuous Delivery keeps software always in a releasable state, often with a manual approve step. Continuous Deployment goes further and ships every green change automatically. Both rely on strong automated tests and safe rollback paths.",
        a11yNotes: [],
        "commonMistakes": [
          "Equating CD with pushing to production with no tests",
          "Automating deploy without rollback",
          "Confusing delivery with deployment"
        ],
        "bestPractices": [
          "Automate as far as confidence allows",
          "Require approvals for sensitive environments",
          "Pair CD with observability"
        ],
        "interviewQuestions": [
          "Delivery vs deployment?",
          "What enables safe CD?",
          "When is manual approval useful?"
        ],
        "cheatSheet": [
          {
            "tag": "delivery",
            "desc": "Always releasable with optional approve"
          },
          {
            "tag": "deployment",
            "desc": "Automatic release to users"
          },
          {
            "tag": "approve",
            "desc": "Human gate before production"
          }
        ]
      },
      {
        "slug": "pipeline-stages",
        "title": "Pipeline Stages",
        "summary": "Pipelines are ordered stages such as build, test, and deploy.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "stages",
          "jobs",
          "pipeline"
        ],
        "challengeWeight": 4,
        "explanation": "A pipeline is a graph of jobs and steps. Early stages validate quickly; later stages may build artifacts and deploy. Failed stages should stop promotion. Clear stage names help teams understand where a change is blocked.",
        a11yNotes: [],
        "commonMistakes": [
          "One giant job that is hard to debug",
          "Deploying before tests finish",
          "No artifact handoff between stages"
        ],
        "bestPractices": [
          "Fail fast on cheap checks",
          "Pass artifacts between stages",
          "Name stages by purpose"
        ],
        "interviewQuestions": [
          "Name common pipeline stages",
          "Why fail fast?",
          "How do artifacts move between stages?"
        ],
        "cheatSheet": [
          {
            "tag": "build",
            "desc": "Compile or package the app"
          },
          {
            "tag": "test",
            "desc": "Automated verification stage"
          },
          {
            "tag": "deploy",
            "desc": "Release stage to an environment"
          }
        ]
      },
      {
        "slug": "why-automate",
        "title": "Why Automate?",
        "summary": "Automation reduces human error and makes releases repeatable.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "automation",
          "repeatable",
          "toil"
        ],
        "challengeWeight": 3,
        "explanation": "Manual releases depend on memory and timing. Automation encodes the steps, runs them the same way every time, and leaves an audit trail. People still decide product risk, but machines execute the checklist.",
        a11yNotes: [],
        "commonMistakes": [
          "Documenting a process only in chat history",
          "Skipping automation because 'it is faster by hand'",
          "Automating without logging what ran"
        ],
        "bestPractices": [
          "Encode release steps in pipelines",
          "Prefer scripts over tribal knowledge",
          "Keep humans for judgment, machines for execution"
        ],
        "interviewQuestions": [
          "What toil does CI/CD remove?",
          "Why is repeatability valuable?",
          "What should humans still decide?"
        ],
        "cheatSheet": [
          {
            "tag": "toil",
            "desc": "Repetitive manual operational work"
          },
          {
            "tag": "audit trail",
            "desc": "Record of what ran and when"
          },
          {
            "tag": "script",
            "desc": "Executable encoding of a procedure"
          }
        ]
      }
    ]
  },
  {
    "slug": "workflow-mechanics",
    "title": "Workflow Mechanics",
    "description": "Triggers, jobs, steps, runners, and status checks.",
    "topics": [
      {
        "slug": "triggers-push-pr",
        "title": "Triggers: Push and PR",
        "summary": "Workflows start on events like push, pull_request, or schedule.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "trigger",
          "push",
          "pull_request"
        ],
        "challengeWeight": 4,
        "explanation": "CI systems listen for repository events. Pull request triggers validate proposed changes before merge. Push triggers may run on main for release pipelines. Schedules handle nightly jobs. Choosing the right trigger prevents unnecessary runs and missed checks.",
        a11yNotes: [],
        "commonMistakes": [
          "Only testing after merge to main",
          "Running expensive deploys on every push to every branch",
          "No PR checks for required quality gates"
        ],
        "bestPractices": [
          "Require PR checks before merge",
          "Scope expensive jobs to protected branches",
          "Use path filters when useful"
        ],
        "interviewQuestions": [
          "When should PR triggers run?",
          "Why not deploy every branch push?",
          "What is a schedule trigger?"
        ],
        "cheatSheet": [
          {
            "tag": "pull_request",
            "desc": "Event when a PR opens or updates"
          },
          {
            "tag": "push",
            "desc": "Event when commits are pushed"
          },
          {
            "tag": "schedule",
            "desc": "Cron-based workflow trigger"
          }
        ]
      },
      {
        "slug": "jobs-and-steps",
        "title": "Jobs and Steps",
        "summary": "Jobs run in parallel or sequence; steps run commands inside a job.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "jobs",
          "steps",
          "needs"
        ],
        "challengeWeight": 4,
        "explanation": "A workflow contains jobs. Each job has steps that checkout code, set up tools, and run commands. Jobs can depend on other jobs with needs. Parallel jobs speed feedback when independent.",
        a11yNotes: [],
        "commonMistakes": [
          "Putting unrelated work in one huge job",
          "Missing checkout before running tests",
          "Hidden dependencies between supposedly parallel jobs"
        ],
        "bestPractices": [
          "Keep jobs focused",
          "Declare needs for ordering",
          "Fail a job when a critical step fails"
        ],
        "interviewQuestions": [
          "Job vs step?",
          "How do you sequence jobs?",
          "Why parallelize?"
        ],
        "cheatSheet": [
          {
            "tag": "job",
            "desc": "Unit of work on a runner"
          },
          {
            "tag": "step",
            "desc": "Single command or action in a job"
          },
          {
            "tag": "needs",
            "desc": "Job dependency declaration"
          }
        ]
      },
      {
        "slug": "runners",
        "title": "Runners",
        "summary": "Runners are the machines that execute workflow jobs.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "runner",
          "hosted",
          "self-hosted"
        ],
        "challengeWeight": 3,
        "explanation": "Hosted runners are provided by the CI platform. Self-hosted runners run on your infrastructure for special hardware, network access, or cost control. Runner labels select where jobs execute. Secure self-hosted runners carefully because they often hold credentials.",
        a11yNotes: [],
        "commonMistakes": [
          "Exposing self-hosted runners to untrusted forks carelessly",
          "Assuming infinite concurrency",
          "No cleanup of workspace state"
        ],
        "bestPractices": [
          "Prefer hosted runners unless you need special access",
          "Isolate self-hosted runners",
          "Clean workspaces between jobs"
        ],
        "interviewQuestions": [
          "Hosted vs self-hosted?",
          "What is a runner label?",
          "What risk do self-hosted runners add?"
        ],
        "cheatSheet": [
          {
            "tag": "hosted",
            "desc": "CI-provider managed machines"
          },
          {
            "tag": "self-hosted",
            "desc": "Runner machines you operate"
          },
          {
            "tag": "label",
            "desc": "Selector for runner pools"
          }
        ]
      },
      {
        "slug": "status-checks",
        "title": "Status Checks",
        "summary": "Status checks report job results back to pull requests.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "status",
          "checks",
          "required"
        ],
        "challengeWeight": 4,
        "explanation": "Each workflow run posts status to the commit or PR. Required status checks block merge until they pass. Clear check names help reviewers. Checks should be stable; flaky required checks slow the whole team.",
        a11yNotes: [],
        "commonMistakes": [
          "Required checks that are flaky",
          "Vague check names",
          "Optional important checks that nobody notices failing"
        ],
        "bestPractices": [
          "Make critical checks required",
          "Name checks clearly",
          "Fix flake before requiring the check"
        ],
        "interviewQuestions": [
          "What is a required status check?",
          "Where do checks appear?",
          "Why is flake costly?"
        ],
        "cheatSheet": [
          {
            "tag": "required check",
            "desc": "Must pass before merge"
          },
          {
            "tag": "commit status",
            "desc": "Pass/fail reported for a SHA"
          },
          {
            "tag": "check run",
            "desc": "Detailed CI result on a PR"
          }
        ]
      }
    ]
  },
  {
    "slug": "github-actions",
    "title": "GitHub Actions",
    "description": "Workflow YAML and Actions ecosystem basics.",
    "topics": [
      {
        "slug": "workflow-yaml-basics",
        "title": "Workflow YAML Basics",
        "summary": "GitHub Actions workflows are YAML files under .github/workflows.",
        "estimatedMinutes": 14,
        "difficulty": "beginner",
        "keywords": [
          "github-actions",
          "yaml",
          "workflow"
        ],
        "challengeWeight": 5,
        "explanation": "A workflow file declares name, on triggers, jobs, runs-on, and steps. Steps may use uses: to call an action or run: to execute shell. YAML indentation is significant. Start simple: checkout, setup, test.",
        a11yNotes: [],
        "commonMistakes": [
          "Invalid indentation breaking the workflow",
          "Hardcoding secrets in YAML",
          "No checkout step before reading the repo"
        ],
        "bestPractices": [
          "Validate YAML locally when possible",
          "Use secrets context for credentials",
          "Begin with a minimal green workflow"
        ],
        "interviewQuestions": [
          "Where do workflow files live?",
          "uses vs run?",
          "What does runs-on select?"
        ],
        "cheatSheet": [
          {
            "tag": "on:",
            "desc": "Workflow trigger configuration"
          },
          {
            "tag": "jobs:",
            "desc": "Map of jobs in the workflow"
          },
          {
            "tag": "runs-on",
            "desc": "Runner image or labels"
          }
        ]
      },
      {
        "slug": "actions-marketplace",
        "title": "Actions Marketplace",
        "summary": "Reusable actions encapsulate common CI steps.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "actions",
          "marketplace",
          "uses"
        ],
        "challengeWeight": 3,
        "explanation": "The Actions marketplace provides checkout, setup-node, cache, and many more. Pin actions to a full commit SHA for stronger supply-chain safety when needed. Prefer official or well-maintained actions. Understand what permissions an action needs.",
        a11yNotes: [],
        "commonMistakes": [
          "Using untrusted actions with broad permissions",
          "Never pinning critical actions",
          "Ignoring action documentation"
        ],
        "bestPractices": [
          "Prefer official actions for core setup",
          "Review permissions requested",
          "Pin versions intentionally"
        ],
        "interviewQuestions": [
          "What does uses: mean?",
          "Why pin action versions?",
          "What should you review before adopting an action?"
        ],
        "cheatSheet": [
          {
            "tag": "uses",
            "desc": "Reference an action in a step"
          },
          {
            "tag": "pin",
            "desc": "Lock an action to a version or SHA"
          },
          {
            "tag": "marketplace",
            "desc": "Catalog of reusable actions"
          }
        ]
      },
      {
        "slug": "reusable-workflows",
        "title": "Reusable Workflows",
        "summary": "Reusable workflows share pipeline logic across repositories.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "reusable",
          "workflow_call",
          "dry"
        ],
        "challengeWeight": 4,
        "explanation": "Reusable workflows let one repository define a callable pipeline that others invoke with workflow_call. This reduces duplication for standard build-test-deploy patterns. Inputs and secrets are passed explicitly. Version the reusable workflow thoughtfully.",
        a11yNotes: [],
        "commonMistakes": [
          "Copy-pasting huge workflows into every repo",
          "Passing all secrets by default",
          "No versioning strategy for shared workflows"
        ],
        "bestPractices": [
          "Centralize common pipelines",
          "Pass only needed secrets",
          "Document inputs and outputs"
        ],
        "interviewQuestions": [
          "What is workflow_call?",
          "Why reuse workflows?",
          "What should be parameterized?"
        ],
        "cheatSheet": [
          {
            "tag": "workflow_call",
            "desc": "Trigger for reusable workflows"
          },
          {
            "tag": "inputs",
            "desc": "Parameters passed into reusable workflows"
          },
          {
            "tag": "secrets",
            "desc": "Sensitive values passed explicitly"
          }
        ]
      },
      {
        "slug": "workflow-permissions",
        "title": "Workflow Permissions",
        "summary": "Least-privilege GITHUB_TOKEN permissions reduce blast radius.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "permissions",
          "token",
          "security"
        ],
        "challengeWeight": 4,
        "explanation": "GitHub Actions jobs receive a GITHUB_TOKEN with configurable permissions. Default to read-only and grant write only when needed for releases or PR comments. Restrict workflows triggered by forks. Permissions mistakes can allow malicious PRs to escalate.",
        a11yNotes: [],
        "commonMistakes": [
          "contents: write on every workflow by default",
          "Untrusted fork workflows with secrets",
          "No review of permission blocks"
        ],
        "bestPractices": [
          "Set permissions explicitly",
          "Prefer pull_request_target carefully or avoid it",
          "Grant the minimum scopes required"
        ],
        "interviewQuestions": [
          "What is GITHUB_TOKEN?",
          "Why set permissions explicitly?",
          "What is the risk with fork PRs?"
        ],
        "cheatSheet": [
          {
            "tag": "permissions",
            "desc": "Token scope block in a workflow"
          },
          {
            "tag": "GITHUB_TOKEN",
            "desc": "Built-in short-lived token for the job"
          },
          {
            "tag": "least privilege",
            "desc": "Only the access needed to complete the job"
          }
        ]
      }
    ]
  },
  {
    "slug": "quality-gates",
    "title": "Quality Gates",
    "description": "Build, test, lint, caching, matrices, and flake control.",
    "topics": [
      {
        "slug": "build-test-lint",
        "title": "Build, Test, Lint",
        "summary": "Quality gates catch defects before merge and deploy.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "lint",
          "test",
          "build"
        ],
        "challengeWeight": 4,
        "explanation": "A healthy PR pipeline usually installs dependencies, lints, runs unit tests, and builds. Failures should be actionable. Keep the feedback loop fast so developers run checks often. Separate slow suites into later jobs if needed.",
        a11yNotes: [],
        "commonMistakes": [
          "Only building without tests",
          "Lint rules so noisy they are ignored",
          "No clear failure logs"
        ],
        "bestPractices": [
          "Run lint and unit tests on every PR",
          "Keep critical suites fast",
          "Make failures easy to diagnose"
        ],
        "interviewQuestions": [
          "What belongs in a PR quality gate?",
          "Why keep suites fast?",
          "Build vs test purpose?"
        ],
        "cheatSheet": [
          {
            "tag": "lint",
            "desc": "Static style and bug checks"
          },
          {
            "tag": "unit test",
            "desc": "Fast isolated verification"
          },
          {
            "tag": "build",
            "desc": "Compile/package verification"
          }
        ]
      },
      {
        "slug": "caching-dependencies",
        "title": "Caching Dependencies",
        "summary": "Caches speed CI by reusing downloaded packages between runs.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "cache",
          "dependencies",
          "speed"
        ],
        "challengeWeight": 4,
        "explanation": "Dependency caches key on lockfiles so installs skip redundant downloads. Bad cache keys cause stale or missing hits. Always verify the build still works on a cold cache. Caches are an optimization, not a correctness requirement.",
        a11yNotes: [],
        "commonMistakes": [
          "Caching without including the lockfile in the key",
          "Assuming caches are always present",
          "Caching build outputs incorrectly and shipping stale artifacts"
        ],
        "bestPractices": [
          "Key caches on lockfiles",
          "Test cold-cache runs periodically",
          "Do not treat cache hits as required"
        ],
        "interviewQuestions": [
          "What should a dependency cache key include?",
          "Why test cold cache?",
          "Cache vs artifact?"
        ],
        "cheatSheet": [
          {
            "tag": "cache key",
            "desc": "Fingerprint that determines cache reuse"
          },
          {
            "tag": "lockfile",
            "desc": "Pinned dependency versions file"
          },
          {
            "tag": "cold cache",
            "desc": "Run with no existing cache"
          }
        ]
      },
      {
        "slug": "matrix-builds",
        "title": "Matrix Builds",
        "summary": "Matrices run the same job across versions or platforms.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "matrix",
          "strategy",
          "versions"
        ],
        "challengeWeight": 4,
        "explanation": "A matrix strategy expands one job into many combinations such as Node 18/20 or OS variants. Fail-fast can stop remaining matrix legs when one fails. Matrices catch compatibility bugs earlier but multiply CI minutes.",
        a11yNotes: [],
        "commonMistakes": [
          "Huge matrices that exhaust minutes with little value",
          "No fail-fast policy consideration",
          "Duplicating setup instead of using matrix"
        ],
        "bestPractices": [
          "Matrix only meaningful dimensions",
          "Use fail-fast thoughtfully",
          "Share setup steps across legs"
        ],
        "interviewQuestions": [
          "What is a build matrix?",
          "When is matrix worth the cost?",
          "What does fail-fast do?"
        ],
        "cheatSheet": [
          {
            "tag": "strategy.matrix",
            "desc": "Expands jobs across combinations"
          },
          {
            "tag": "fail-fast",
            "desc": "Cancel remaining legs after a failure"
          },
          {
            "tag": "include/exclude",
            "desc": "Customize matrix combinations"
          }
        ]
      },
      {
        "slug": "flaky-tests",
        "title": "Flaky Tests",
        "summary": "Flaky tests randomly fail and erode trust in CI.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "flake",
          "quarantine",
          "reliability"
        ],
        "challengeWeight": 4,
        "explanation": "Flakes often come from time dependence, shared state, or network calls. Quarantine known flakes, track them, and fix root causes. Never ignore a red build forever. Retries can help triage but hide problems if overused.",
        a11yNotes: [],
        "commonMistakes": [
          "Retrying forever instead of fixing",
          "Disabling required checks because of flake",
          "Shared mutable fixtures across tests"
        ],
        "bestPractices": [
          "Quarantine and track flakes",
          "Prefer deterministic tests",
          "Use retries sparingly"
        ],
        "interviewQuestions": [
          "What makes a test flaky?",
          "Why do flakes hurt teams?",
          "What is quarantine?"
        ],
        "cheatSheet": [
          {
            "tag": "flake",
            "desc": "Non-deterministic test failure"
          },
          {
            "tag": "quarantine",
            "desc": "Temporarily isolate unreliable tests"
          },
          {
            "tag": "retry",
            "desc": "Re-run a failed test or job"
          }
        ]
      }
    ]
  },
  {
    "slug": "artifacts-deploy",
    "title": "Artifacts and Deploy Jobs",
    "description": "Build outputs, environments, and deployment workflows.",
    "topics": [
      {
        "slug": "build-artifacts-ci",
        "title": "Build Artifacts in CI",
        "summary": "CI uploads artifacts so later jobs or humans can download outputs.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "artifacts",
          "upload",
          "download"
        ],
        "challengeWeight": 4,
        "explanation": "Artifacts may include coverage reports, binaries, or bundled sites. Retention policies control storage cost. Deploy jobs should consume the exact artifact produced by the build job for that commit.",
        a11yNotes: [],
        "commonMistakes": [
          "Rebuilding differently in the deploy job",
          "Unlimited retention of huge artifacts",
          "Uploading secrets as artifacts"
        ],
        "bestPractices": [
          "Build once and reuse artifacts",
          "Set retention intentionally",
          "Never upload secrets"
        ],
        "interviewQuestions": [
          "Why upload artifacts?",
          "Build once deploy many in CI?",
          "What should not be an artifact?"
        ],
        "cheatSheet": [
          {
            "tag": "upload-artifact",
            "desc": "Store files from a job"
          },
          {
            "tag": "download-artifact",
            "desc": "Restore files in a later job"
          },
          {
            "tag": "retention",
            "desc": "How long artifacts are kept"
          }
        ]
      },
      {
        "slug": "environment-protection",
        "title": "Environment Protection",
        "summary": "Protected environments add approvals and secret scoping for deploys.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "environment",
          "approval",
          "protection"
        ],
        "challengeWeight": 4,
        "explanation": "GitHub Environments can require reviewers before production jobs run and restrict which branches may deploy. Environment secrets stay scoped. Use environments to separate staging and production credentials.",
        a11yNotes: [],
        "commonMistakes": [
          "Using production secrets in PR jobs",
          "No approval on production deploys",
          "One environment for everything"
        ],
        "bestPractices": [
          "Create distinct environments",
          "Require reviewers for production",
          "Scope secrets per environment"
        ],
        "interviewQuestions": [
          "What does an environment add?",
          "Why approve production?",
          "How are environment secrets scoped?"
        ],
        "cheatSheet": [
          {
            "tag": "environment",
            "desc": "Named deployment target with rules"
          },
          {
            "tag": "required reviewers",
            "desc": "Humans who must approve"
          },
          {
            "tag": "environment secret",
            "desc": "Secret available only to that environment"
          }
        ]
      },
      {
        "slug": "deployment-jobs",
        "title": "Deployment Jobs",
        "summary": "Deploy jobs push a verified artifact to an environment.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "deploy",
          "job",
          "release"
        ],
        "challengeWeight": 4,
        "explanation": "Deploy jobs usually need: needs: [build], environment: production, and steps that authenticate then release. Keep deploy scripts idempotent when possible. Record the git SHA that was deployed.",
        a11yNotes: [],
        "commonMistakes": [
          "Deploying without waiting for tests",
          "No record of which SHA went out",
          "Non-idempotent scripts that fail on retry"
        ],
        "bestPractices": [
          "Gate deploy on green checks",
          "Log release SHA",
          "Make deploys retry-safe when possible"
        ],
        "interviewQuestions": [
          "What should a deploy job wait for?",
          "Why log the SHA?",
          "What is idempotent deploy?"
        ],
        "cheatSheet": [
          {
            "tag": "needs",
            "desc": "Wait for upstream jobs"
          },
          {
            "tag": "environment",
            "desc": "Target with protection rules"
          },
          {
            "tag": "SHA",
            "desc": "Commit identifier deployed"
          }
        ]
      },
      {
        "slug": "preview-deploys",
        "title": "Preview Deploys",
        "summary": "Preview environments let reviewers click a live PR build.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "preview",
          "pr",
          "ephemeral"
        ],
        "challengeWeight": 4,
        "explanation": "Preview deploys create temporary URLs for pull requests. They improve review quality for UI and API changes. Use separate secrets and data so previews cannot touch production. Tear down previews when PRs close.",
        a11yNotes: [],
        "commonMistakes": [
          "Pointing previews at production databases",
          "Leaving orphan preview environments forever",
          "No auth on sensitive previews"
        ],
        "bestPractices": [
          "Isolate preview data and secrets",
          "Auto-cleanup on PR close",
          "Protect sensitive previews"
        ],
        "interviewQuestions": [
          "What is a preview deploy?",
          "Why isolate preview data?",
          "When should previews be destroyed?"
        ],
        "cheatSheet": [
          {
            "tag": "preview URL",
            "desc": "Temporary environment for a PR"
          },
          {
            "tag": "ephemeral",
            "desc": "Short-lived infrastructure"
          },
          {
            "tag": "cleanup",
            "desc": "Destroy resources after use"
          }
        ]
      }
    ]
  },
  {
    "slug": "secrets-identity",
    "title": "Secrets and Identity",
    "description": "CI secrets, OIDC, and least privilege.",
    "topics": [
      {
        "slug": "ci-secrets",
        "title": "CI Secrets",
        "summary": "Store credentials in the CI secret store, not in YAML.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "secrets",
          "credentials",
          "ci"
        ],
        "challengeWeight": 4,
        "explanation": "CI systems provide encrypted secret storage exposed as environment variables at runtime. Limit who can edit secrets. Avoid printing secrets in logs. Rotate when people leave or leaks occur.",
        a11yNotes: [],
        "commonMistakes": [
          "Echoing secrets for debugging",
          "Storing prod credentials in the repo",
          "Sharing one secret across all environments"
        ],
        "bestPractices": [
          "Use the platform secret store",
          "Redact logs",
          "Rotate and scope secrets"
        ],
        "interviewQuestions": [
          "Where should CI credentials live?",
          "Why not print secrets?",
          "When should you rotate?"
        ],
        "cheatSheet": [
          {
            "tag": "secrets.NAME",
            "desc": "Reference a stored CI secret"
          },
          {
            "tag": "masking",
            "desc": "Hide secret values in logs"
          },
          {
            "tag": "rotation",
            "desc": "Replace credentials periodically"
          }
        ]
      },
      {
        "slug": "oidc-cloud-auth",
        "title": "OIDC Cloud Auth",
        "summary": "OIDC lets CI assume cloud roles without long-lived access keys.",
        "estimatedMinutes": 14,
        "difficulty": "advanced",
        "keywords": [
          "oidc",
          "iam",
          "federation"
        ],
        "challengeWeight": 5,
        "explanation": "OpenID Connect federation exchanges a short-lived CI identity token for cloud credentials. This avoids storing static AWS/GCP keys in CI. Configure trust conditions tightly to repository, branch, and environment.",
        a11yNotes: [],
        "commonMistakes": [
          "Broad trust policies accepting any repo",
          "Falling back to static keys without need",
          "No audience or subject conditions"
        ],
        "bestPractices": [
          "Prefer OIDC over static keys",
          "Constrain subject claims",
          "Least-privilege roles for deploy"
        ],
        "interviewQuestions": [
          "What problem does OIDC solve in CI?",
          "What should trust policies constrain?",
          "Why are short-lived credentials better?"
        ],
        "cheatSheet": [
          {
            "tag": "OIDC",
            "desc": "Federated identity for short-lived cloud creds"
          },
          {
            "tag": "role assumption",
            "desc": "Exchange identity for cloud permissions"
          },
          {
            "tag": "subject claim",
            "desc": "Identifies repo/ref in the token"
          }
        ]
      },
      {
        "slug": "least-privilege-ci",
        "title": "Least Privilege in CI",
        "summary": "Grant pipelines only the permissions required for their job.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "least-privilege",
          "permissions",
          "scope"
        ],
        "challengeWeight": 4,
        "explanation": "A lint job does not need production deploy credentials. Split workflows and tokens by purpose. Compromised CI with broad access is a major incident. Review permission creep during pipeline growth.",
        a11yNotes: [],
        "commonMistakes": [
          "One token that can do everything",
          "Production secrets available to PR workflows",
          "No periodic access review"
        ],
        "bestPractices": [
          "Separate jobs by privilege level",
          "Scope tokens tightly",
          "Review access quarterly"
        ],
        "interviewQuestions": [
          "Why split privileges across jobs?",
          "What is privilege creep?",
          "Should PR jobs see prod secrets?"
        ],
        "cheatSheet": [
          {
            "tag": "scope",
            "desc": "Limited permission boundary"
          },
          {
            "tag": "separation",
            "desc": "Different credentials per job purpose"
          },
          {
            "tag": "blast radius",
            "desc": "Damage possible if CI is compromised"
          }
        ]
      },
      {
        "slug": "secret-scanning-basics",
        "title": "Secret Scanning Basics",
        "summary": "Detect accidental credential commits before they spread.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "scanning",
          "leak",
          "credentials"
        ],
        "challengeWeight": 3,
        "explanation": "Secret scanning tools look for tokens in git history and PRs. Enable platform scanning and pre-commit hooks where practical. If a secret leaks, rotate it immediately; deleting the commit is not enough if it was pushed.",
        a11yNotes: [],
        "commonMistakes": [
          "Thinking git history rewrite alone fixes a leaked key",
          "Disabling scanning alerts",
          "Committing .env files"
        ],
        "bestPractices": [
          "Enable secret scanning",
          "Rotate leaked credentials immediately",
          "Block commits of common secret files"
        ],
        "interviewQuestions": [
          "What should you do after a leak?",
          "Why is history rewrite insufficient?",
          "Where can scanning run?"
        ],
        "cheatSheet": [
          {
            "tag": "secret scanning",
            "desc": "Automated detection of credentials in git"
          },
          {
            "tag": "rotate",
            "desc": "Invalidate and replace a leaked secret"
          },
          {
            "tag": "pre-commit",
            "desc": "Local hook before a commit is created"
          }
        ]
      }
    ]
  },
  {
    "slug": "branch-rules",
    "title": "Branch Rules",
    "description": "Protection rules, required checks, and safer merges.",
    "topics": [
      {
        "slug": "branch-protection",
        "title": "Branch Protection",
        "summary": "Protect main so changes land only through reviewed, checked PRs.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "branch",
          "protection",
          "main"
        ],
        "challengeWeight": 4,
        "explanation": "Branch protection can require pull requests, approvals, and status checks before merge. It prevents direct pushes that bypass CI. Admins should be constrained too when possible. Protection is a social and technical control.",
        a11yNotes: [],
        "commonMistakes": [
          "Allowing everyone to push to main",
          "Admin bypass used casually",
          "No required reviews on critical repos"
        ],
        "bestPractices": [
          "Require PRs to main",
          "Require approvals and checks",
          "Limit bypass exceptions"
        ],
        "interviewQuestions": [
          "What does branch protection enforce?",
          "Why require PRs?",
          "What is an admin bypass risk?"
        ],
        "cheatSheet": [
          {
            "tag": "protected branch",
            "desc": "Branch with enforced rules"
          },
          {
            "tag": "required review",
            "desc": "Approval needed before merge"
          },
          {
            "tag": "bypass",
            "desc": "Exception that skips rules"
          }
        ]
      },
      {
        "slug": "required-checks",
        "title": "Required Checks",
        "summary": "Required checks are the merge gate for quality.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "required",
          "checks",
          "gate"
        ],
        "challengeWeight": 3,
        "explanation": "Choose a small set of must-pass checks: lint, unit tests, and build are common. Optional informative checks can still run. Changing check names can accidentally remove requirements until updated.",
        a11yNotes: [],
        "commonMistakes": [
          "Requiring twenty slow checks on every PR",
          "Renaming jobs without updating protection rules",
          "Required flake"
        ],
        "bestPractices": [
          "Keep required set lean and reliable",
          "Update protection when renaming checks",
          "Fix flake in required suites first"
        ],
        "interviewQuestions": [
          "What should be required?",
          "What happens if a check is renamed?",
          "Why keep the set small?"
        ],
        "cheatSheet": [
          {
            "tag": "merge gate",
            "desc": "Conditions that must pass to merge"
          },
          {
            "tag": "check name",
            "desc": "Identifier referenced by protection rules"
          },
          {
            "tag": "optional check",
            "desc": "Visible but not required"
          }
        ]
      },
      {
        "slug": "merge-queues-basics",
        "title": "Merge Queues Basics",
        "summary": "Merge queues retest batched PRs against the latest main.",
        "estimatedMinutes": 12,
        "difficulty": "advanced",
        "keywords": [
          "merge-queue",
          "batch",
          "serialize"
        ],
        "challengeWeight": 4,
        "explanation": "Merge queues reduce broken main by testing the integration of multiple ready PRs before landing. They help busy repositories where main moves quickly. Queues add latency but improve stability.",
        a11yNotes: [],
        "commonMistakes": [
          "Enabling a queue without reliable CI",
          "Expecting zero wait time",
          "Ignoring queue failure diagnosis"
        ],
        "bestPractices": [
          "Use queues when main breaks often from races",
          "Keep CI fast enough for queue throughput",
          "Monitor queue wait times"
        ],
        "interviewQuestions": [
          "What problem do merge queues solve?",
          "What is the trade-off?",
          "When are they worth it?"
        ],
        "cheatSheet": [
          {
            "tag": "merge queue",
            "desc": "Serialized integration testing before merge"
          },
          {
            "tag": "batch",
            "desc": "Group of PRs tested together"
          },
          {
            "tag": "throughput",
            "desc": "How many PRs land per time window"
          }
        ]
      },
      {
        "slug": "monorepo-ci-paths",
        "title": "Monorepo Path Filters",
        "summary": "Path filters run only the CI relevant to changed packages.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "monorepo",
          "paths",
          "filter"
        ],
        "challengeWeight": 4,
        "explanation": "In monorepos, path filters and affected-package detection avoid running every pipeline on every change. Incorrect filters can skip necessary tests. Combine path filters with periodic full builds.",
        a11yNotes: [],
        "commonMistakes": [
          "Filters that skip critical shared package tests",
          "No full build ever",
          "Over-filtering release pipelines"
        ],
        "bestPractices": [
          "Include shared dependencies in affected graphs",
          "Run full CI on a schedule or main",
          "Review filters when structure changes"
        ],
        "interviewQuestions": [
          "Why filter by path?",
          "What is the risk of over-filtering?",
          "When run full CI?"
        ],
        "cheatSheet": [
          {
            "tag": "paths",
            "desc": "Trigger filter by changed files"
          },
          {
            "tag": "affected",
            "desc": "Packages impacted by a change"
          },
          {
            "tag": "full build",
            "desc": "CI covering the entire repository"
          }
        ]
      }
    ]
  },
  {
    "slug": "containers-in-ci",
    "title": "Containers in CI",
    "description": "Build and publish images from pipelines.",
    "topics": [
      {
        "slug": "docker-build-ci",
        "title": "Docker Build in CI",
        "summary": "CI can build images to verify Dockerfiles and produce deployables.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "docker",
          "build",
          "ci"
        ],
        "challengeWeight": 4,
        "explanation": "Building images in CI validates Dockerfiles on clean runners. Use build args carefully and never pass secrets as plain build args that persist in layers. Tag images with the git SHA.",
        a11yNotes: [],
        "commonMistakes": [
          "Baking secrets via build args",
          "Untagged local-only images for releases",
          "No Dockerfile lint or build on PRs"
        ],
        "bestPractices": [
          "Build images on PRs when Docker is part of the product",
          "Tag with SHA",
          "Keep secrets out of layers"
        ],
        "interviewQuestions": [
          "Why build Docker in CI?",
          "How should release images be tagged?",
          "Why are secret build args risky?"
        ],
        "cheatSheet": [
          {
            "tag": "docker build",
            "desc": "Create an image from a Dockerfile"
          },
          {
            "tag": "build-arg",
            "desc": "Build-time variable; can leak into layers"
          },
          {
            "tag": "SHA tag",
            "desc": "Image tag matching the commit"
          }
        ]
      },
      {
        "slug": "push-image-registry",
        "title": "Push Image to Registry",
        "summary": "Publish images so deploy environments can pull them.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "push",
          "registry",
          "ghcr"
        ],
        "challengeWeight": 4,
        "explanation": "After a successful build, CI authenticates to a registry and pushes tags. Production deploys should pull by immutable digest or unique tag. Separate CI write credentials from runtime pull credentials when possible.",
        a11yNotes: [],
        "commonMistakes": [
          "Pushing on every PR without retention policy",
          "Using the same credential for push and broad admin",
          "Mutable latest as the only production reference"
        ],
        "bestPractices": [
          "Push release tags from protected branches",
          "Prefer immutable tags/digests",
          "Least-privilege registry tokens"
        ],
        "interviewQuestions": [
          "When should CI push images?",
          "Why immutable tags?",
          "How to authenticate pushes?"
        ],
        "cheatSheet": [
          {
            "tag": "docker push",
            "desc": "Upload image tags to a registry"
          },
          {
            "tag": "GHCR",
            "desc": "GitHub Container Registry"
          },
          {
            "tag": "digest",
            "desc": "Immutable content address"
          }
        ]
      },
      {
        "slug": "cache-docker-layers",
        "title": "Cache Docker Layers",
        "summary": "Layer caching speeds repeated image builds in CI.",
        "estimatedMinutes": 12,
        "difficulty": "advanced",
        "keywords": [
          "cache",
          "layers",
          "buildx"
        ],
        "challengeWeight": 4,
        "explanation": "BuildKit and remote cache backends reuse unchanged layers across CI runs. Order Dockerfile instructions for cache hits. Caching is optional acceleration; correctness still requires reproducible Dockerfiles.",
        a11yNotes: [],
        "commonMistakes": [
          "Relying on cache for correctness",
          "Poor instruction order defeating cache",
          "Unbounded cache storage growth"
        ],
        "bestPractices": [
          "Optimize Dockerfile order",
          "Use remote cache thoughtfully",
          "Verify builds without cache periodically"
        ],
        "interviewQuestions": [
          "What is layer caching?",
          "How does instruction order matter?",
          "Cache vs correctness?"
        ],
        "cheatSheet": [
          {
            "tag": "BuildKit",
            "desc": "Modern Docker build engine"
          },
          {
            "tag": "remote cache",
            "desc": "Shared layer cache across runners"
          },
          {
            "tag": "cache hit",
            "desc": "Reusing an unchanged layer"
          }
        ]
      }
    ]
  },
  {
    "slug": "release-safety",
    "title": "Release Safety",
    "description": "Failures, rollbacks, flags, and pipeline visibility.",
    "topics": [
      {
        "slug": "failure-handling",
        "title": "Failure Handling",
        "summary": "Failed pipelines must stop promotion and notify owners.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "failure",
          "notify",
          "gate"
        ],
        "challengeWeight": 3,
        "explanation": "When CI fails, do not deploy. Notify the author, keep logs accessible, and avoid silent continue-on-error for critical steps. Distinguish expected non-blocking warnings from hard failures.",
        a11yNotes: [],
        "commonMistakes": [
          "continue-on-error on tests",
          "Deploying after a failed build job",
          "No notification when main fails"
        ],
        "bestPractices": [
          "Fail closed for critical gates",
          "Preserve logs",
          "Alert on main failures"
        ],
        "interviewQuestions": [
          "What should happen when tests fail?",
          "When is continue-on-error acceptable?",
          "Why preserve logs?"
        ],
        "cheatSheet": [
          {
            "tag": "fail closed",
            "desc": "Block progress on failure"
          },
          {
            "tag": "continue-on-error",
            "desc": "Allow job to proceed despite step failure"
          },
          {
            "tag": "notification",
            "desc": "Alert humans about pipeline results"
          }
        ]
      },
      {
        "slug": "rollback-automation",
        "title": "Rollback Automation",
        "summary": "Automate reverting to the previous artifact when health worsens.",
        "estimatedMinutes": 14,
        "difficulty": "advanced",
        "keywords": [
          "rollback",
          "automation",
          "health"
        ],
        "challengeWeight": 5,
        "explanation": "Automated rollback redeploys the last known good release when smoke tests or metrics fail. It requires versioned artifacts and clear abort criteria. Not every failure should auto-rollback; some need human diagnosis first.",
        a11yNotes: [],
        "commonMistakes": [
          "No previous artifact to restore",
          "Auto-rollback on noisy flaky metrics",
          "Rollback that cannot reverse a breaking migration"
        ],
        "bestPractices": [
          "Keep previous artifacts",
          "Define clear abort rules",
          "Understand migration constraints"
        ],
        "interviewQuestions": [
          "What does automated rollback need?",
          "When should humans decide?",
          "How do migrations affect rollback?"
        ],
        "cheatSheet": [
          {
            "tag": "last known good",
            "desc": "Previous healthy release artifact"
          },
          {
            "tag": "abort criteria",
            "desc": "Signals that trigger rollback"
          },
          {
            "tag": "auto-rollback",
            "desc": "Pipeline-driven restore of prior release"
          }
        ]
      },
      {
        "slug": "feature-flags-releases",
        "title": "Feature Flags and Releases",
        "summary": "Flags separate deploy from release of risky behavior.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "flags",
          "release",
          "toggle"
        ],
        "challengeWeight": 4,
        "explanation": "Feature flags let you deploy dark code and enable it gradually. This reduces the need for emergency code rollback for many product changes. Flags need cleanup and access control so they do not become permanent debt.",
        a11yNotes: [],
        "commonMistakes": [
          "Never removing old flags",
          "Using flags as a substitute for testing",
          "Client-only flags for security-sensitive behavior"
        ],
        "bestPractices": [
          "Deploy dark, release with flags",
          "Clean up flags after rollout",
          "Enforce sensitive checks server-side"
        ],
        "interviewQuestions": [
          "Deploy vs release with flags?",
          "Why clean up flags?",
          "What should not rely on client flags alone?"
        ],
        "cheatSheet": [
          {
            "tag": "dark launch",
            "desc": "Deploy code disabled by default"
          },
          {
            "tag": "flag",
            "desc": "Runtime toggle for a behavior"
          },
          {
            "tag": "cleanup",
            "desc": "Remove flags after full release"
          }
        ]
      },
      {
        "slug": "pipeline-observability",
        "title": "Pipeline Observability",
        "summary": "Measure pipeline duration, failure rates, and queue time.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "metrics",
          "duration",
          "ci"
        ],
        "challengeWeight": 4,
        "explanation": "Slow or unreliable pipelines reduce how often teams integrate. Track median duration, flake rate, and time-to-green. Optimize the slowest stages. Observability for CI is as important as for production services.",
        a11yNotes: [],
        "commonMistakes": [
          "No idea which job dominates time",
          "Accepting rising flake rates",
          "Optimizing the wrong stage"
        ],
        "bestPractices": [
          "Track CI KPIs",
          "Fix the slowest critical path first",
          "Budget CI minutes intentionally"
        ],
        "interviewQuestions": [
          "Which CI metrics matter?",
          "What is time-to-green?",
          "How do you prioritize CI speed work?"
        ],
        "cheatSheet": [
          {
            "tag": "duration",
            "desc": "How long a pipeline takes"
          },
          {
            "tag": "flake rate",
            "desc": "Share of non-deterministic failures"
          },
          {
            "tag": "time-to-green",
            "desc": "Time until required checks pass"
          }
        ]
      },
      {
        "slug": "smoke-in-pipeline",
        "title": "Smoke in the Pipeline",
        "summary": "Post-deploy smoke jobs verify the release before declaring success.",
        "estimatedMinutes": 10,
        "difficulty": "intermediate",
        "keywords": [
          "smoke",
          "post-deploy",
          "verify"
        ],
        "challengeWeight": 3,
        "explanation": "After a deploy job, a smoke job hits health and critical routes. Failure can trigger rollback or page an owner. Keep smokes fast and stable. They bridge CI confidence and production reality.",
        a11yNotes: [],
        "commonMistakes": [
          "No verification after deploy",
          "Flaky smoke blocking every release",
          "Smoke that depends on slow full E2E only"
        ],
        "bestPractices": [
          "Add a fast post-deploy smoke job",
          "On failure, stop and investigate or roll back",
          "Keep smoke assertions minimal and stable"
        ],
        "interviewQuestions": [
          "Where do smoke jobs sit in the pipeline?",
          "What should they cover?",
          "What happens on smoke failure?"
        ],
        "cheatSheet": [
          {
            "tag": "post-deploy",
            "desc": "Runs after release to an environment"
          },
          {
            "tag": "smoke job",
            "desc": "CI job for critical path checks"
          },
          {
            "tag": "gate",
            "desc": "Condition before success is declared"
          }
        ]
      },
      {
        "slug": "concurrency-groups",
        "title": "Concurrency Groups",
        "summary": "Concurrency settings cancel outdated runs for the same ref.",
        "estimatedMinutes": 10,
        "difficulty": "intermediate",
        "keywords": [
          "concurrency",
          "cancel",
          "queue"
        ],
        "challengeWeight": 3,
        "explanation": "Concurrency groups prevent piled-up workflow runs when developers push quickly. Cancel-in-progress saves minutes and focuses on the latest commit. Use carefully so you do not cancel production deploys unintentionally.",
        a11yNotes: [],
        "commonMistakes": [
          "Canceling production deploy runs by accident",
          "Unbounded concurrent runs exhausting minutes",
          "No concurrency on busy PR workflows"
        ],
        "bestPractices": [
          "Cancel outdated PR runs",
          "Isolate production concurrency groups",
          "Document cancel behavior"
        ],
        "interviewQuestions": [
          "What does concurrency cancel?",
          "Why isolate production?",
          "When is cancel-in-progress helpful?"
        ],
        "cheatSheet": [
          {
            "tag": "concurrency",
            "desc": "Limit overlapping workflow runs"
          },
          {
            "tag": "cancel-in-progress",
            "desc": "Stop older runs for the same group"
          },
          {
            "tag": "group",
            "desc": "Key that defines the concurrency scope"
          }
        ]
      }
    ]
  }
];

export function flattenCicdTopics(): CicdTopicDef[] {
  return CICD_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
