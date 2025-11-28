# StreamGen-AI: DevSecOps-Focused React + TypeScript Project

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/vite-^5.0-blue)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blueviolet)](https://github.com/features/actions)

**StreamGen-AI** is a modern, secure frontend application built with React + TypeScript + Vite, containerized with Docker, and engineered with **DevSecOps practices** for secure development and deployment.

---

## Table of Contents

- [Key DevSecOps Features](#key-devsecops-features)
- [Prerequisites](#prerequisites)
- [Setup & Development](#setup--development)
- [Production Build](#production-build)
- [Docker Usage](#docker-usage)
- [Security & CI/CD Pipeline](#security--cicd-pipeline)
- [Folder Structure](#folder-structure)
- [License](#license)

---

## Key DevSecOps Features

- **CI/CD with GitHub Actions** for automated build, test, and deployment
- **Dependency scanning** with `npm audit` to catch vulnerabilities early
- **Container security scanning** using **Trivy** to ensure Docker images are secure
- **Multi-stage Docker builds** to reduce attack surface in production images
- **Linting and TypeScript type checks** to enforce code quality and security
- **Environment isolation** with `.env` and Docker containers

---

## Prerequisites

- Node.js >= 20
- npm >= 9
- Docker >= 24
- GitHub account (for CI/CD and DevSecOps integration)

---

## Setup & Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/streamgen-ai.git
   cd streamgen-ai
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open the application:**
   ```
   http://localhost:5173
   ```

5. **Lint code and enforce secure coding practices:**
   ```bash
   npm run lint
   ```

6. **Run tests:**
   ```bash
   npm test
   ```

---

## Production Build

Build optimized production assets:
```bash
npm run build
```
The production-ready files are in the `dist/` folder.

---

## Docker Usage

### Build Docker Image
```bash
docker build -t streamgen-ai .
```

### Run Docker Container
```bash
docker run -p 5173:80 streamgen-ai
```

### DevSecOps Notes:
- **Multi-stage builds** separate build and runtime environments to reduce attack surface.
- **Trivy scanning** is integrated into the CI pipeline to detect critical and high severity vulnerabilities in Docker images.

---

## Security & CI/CD Pipeline

The GitHub Actions pipeline implements DevSecOps principles:

### Build & Test
- Installs dependencies, runs lint and TypeScript checks.
- Executes unit tests to ensure code integrity.

### Dependency Security Scan
- Runs `npm audit` to catch vulnerabilities in npm packages.

### Docker Build & Security Scan
- Builds Docker image.
- Scans image using **Trivy** for high and critical vulnerabilities.

### Optional Deployment
- Pushes Docker image to Docker Hub securely.
- Only deploys from `main` branch.

### Secrets Required in GitHub Actions:
- `DOCKER_USERNAME` – Docker Hub username
- `DOCKER_PASSWORD` – Docker Hub password

### Best Practices:
- Keep secrets in GitHub Actions secrets, never in `.env` files.
- Use multi-stage builds to minimize exposed layers.
- Scan dependencies and images regularly.
- Automate testing and security scans for every PR.

---

## Folder Structure

```bash
streamgen-ai/
├─ components/           # React components
├─ services/             # Business logic / API services
├─ node_modules/         # npm dependencies
├─ App.tsx               # Main App component
├─ index.tsx             # React entry point
├─ index.html            # HTML template
├─ package.json          # npm configuration
├─ tsconfig.json         # TypeScript configuration
├─ vite.config.ts        # Vite configuration
├─ Dockerfile            # Docker build file
├─ README.md             # Documentation
```

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.