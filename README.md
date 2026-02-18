# StreamGen AI

StreamGen AI is a React + TypeScript movie discovery app with AI-powered genre feeds, search, and movie detail enrichment using Google Gemini. The repository also includes Docker, Kubernetes, Terraform, GitHub Actions, and Jenkins pipeline definitions.

## Tech Stack

- React 19
- TypeScript
- Vite 6
- Vitest
- Google GenAI SDK (`@google/genai`)
- Tailwind utility classes via CDN in `index.html`

## Features

- Netflix-style home UI with hero banner and horizontal movie rows
- AI-generated movie lists by genre
- AI-powered search results
- AI-enhanced modal metadata (cast, duration, mood)
- Fallback curated movie data when AI content is unavailable
- Poster/backdrop resolution using TMDB paths, with seeded image fallback

## Project Structure

```text
streamgen-ai/
├── .github/workflows/ci.yml      # GitHub Actions DevSecOps pipeline
├── components/                   # UI components (Navbar, Hero, Row, Modal, MovieCard)
├── services/                     # Gemini integration + tests
├── kubernetes/                   # Deployment + Service manifests
├── terraform/                    # AWS VPC + private EKS Terraform config
├── App.tsx                       # Main app orchestration
├── constants.ts                  # Fallback movie data + genre list
├── index.tsx                     # React entrypoint
├── types.ts                      # Shared TypeScript types
├── Dockerfile                    # Multi-stage build (Node -> Nginx)
├── Jenkinsfile                   # Jenkins pipeline
├── vite.config.ts                # Vite config + env injection
└── README.md
```

## Local Development

### Prerequisites

- Node.js 20+
- npm

### Environment

Create/update `.env.local`:

```env
GEMINI_API_KEY=your_api_key_here
```

`vite.config.ts` maps this value to `process.env.API_KEY` at build/runtime.

### Install and run

```bash
npm ci
npm run dev
```

App runs on `http://localhost:3000` (configured in `vite.config.ts`).

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - create production build in `dist/`
- `npm run preview` - preview production build locally
- `npm test` - run Vitest tests

## Testing

Current tests live in:

- `services/geminiService.test.ts`

Run:

```bash
npm test
```

## Docker

### Build image

```bash
docker build -t streamgen-ai:local .
```

### Run container

```bash
docker run --rm -p 3000:80 streamgen-ai:local
```

Then open `http://localhost:3000`.

## CI/CD and Security (GitHub Actions)

Workflow file: `.github/workflows/ci.yml`

Pipeline stages include:

1. Unit testing (`npm test`)
2. Build (`npm run build`)
3. Dependency scanning (`npm audit`, Snyk)
4. Docker image build + scans (Trivy, Snyk Container)
5. OWASP ZAP baseline DAST scan
6. Terraform config scan (Trivy)
7. Docker image push (main branch)
8. Kubernetes deployment manifest image update (main branch)

### Required GitHub Secrets

- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `SNYK_TOKEN`
- `TOKEN` (used for committing updated K8s manifest)

## Jenkins Pipeline

`Jenkinsfile` defines stages for:

- Unit testing
- Build
- Dependency audit
- Docker build + Trivy image scan

## Kubernetes

Kubernetes manifests in `kubernetes/`:

- `deployment.yaml` - `streamgen-ai` deployment (2 replicas, container port 80)
- `service.yaml` - NodePort service exposing port 80

## Terraform

`terraform/main.tf` provisions:

- AWS provider config
- VPC via `terraform-aws-modules/vpc/aws`
- Private EKS cluster via `terraform-aws-modules/eks/aws`
- Additional security group
- Cluster outputs

Default region in current config: `ap-south-1`.

## Notes

- The workflow includes a lint step (`npm run lint || true`), but no `lint` script currently exists in `package.json`.
- `index.html` includes Tailwind CDN and an import map; the app itself is bundled by Vite for standard local and CI builds.
