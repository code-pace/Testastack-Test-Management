# TestaStack Monorepo (Nx)

This repository is a starter monorepo for TestaStack using Nx. It includes placeholders and Docker configs for an Angular frontend and a NestJS backend.

Quick next steps

1. Install dependencies:

```bash
npm install
```

2. Initialize Nx (if you want the full Nx tooling):

```bash
npx create-nx-workspace@latest --preset=empty --nx-cloud=false
```

Or generate the apps once Nx is installed:

```bash
npx nx g @nrwl/angular:application frontend --style=scss
npx nx g @nrwl/nest:application backend
```

3. To run with Docker (after generating apps and installing deps):

```bash
docker-compose -f docker/docker-compose.yml up --build
```

Notes

- The `workspace.json` contains simple targets that echo the generator commands. Replace with real executors after generating apps.
- This scaffold intentionally leaves app source code out; run the `nx` generators above to create the Angular and Nest apps inside `apps/`.

If you want, I can now run the Nx generators here to create the Angular and Nest apps and then run an initial build.
