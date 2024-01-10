# Weft Monorepo

This is a monorepo project utilizing Turborepo and pnpm workspaces. The project consists of a backend application named `weft-backend` that depends on shared package `weft-domain`. There is also intergration with [BullMQ](https://docs.bullmq.io/) (service for running scheduled, background jobs). This README provides an overview of the project structure, key dependencies, and instructions for building and running the application.

## Dependencies

Here is a list of the main project dependencies:

- **turbo** (build system for monorepo apps)
- **esbuild** (JS->TS compiling)
- **tsx** (TS watch/development)
- **tsc** (TS linting)
- **fastify** (HTTP framework)
- **bullmq** (queue service that uses Redis stream under the hood)
- **knex** (query builder)
- **objection** (ORM)
- **zod** (validation)

## Turborepo

Turborepo is a monorepo build system.

To get started with Turborepo, visit the [Turborepo docs](https://turbo.build/repo/docs).

## Project Structure

```
weft-monorepo/
├── apps/
│ ├── backend/
│ │ ├── package.json
│ │ ├── src/
│ │ │ ├── app.ts
│ │ │ ├── core/
│ │ │ │ └── user.ts
│ │ │ └── services/
│ │ │ └── db/
│ │ │ ├── entities/
│ │ │ │ ├── Group.ts
│ │ │ │ └── User.ts
│ │ │ └── repositories/
│ │ │ ├── KnexUserRepository.ts
│ │ │ └── index.ts
│ │ └── tsconfig.json
├── domain/
│ ├── package.json
│ ├── src/
│ │ ├── index.ts
│ │ └── interfaces.ts
│ └── tsconfig.json
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── turbo.json
```

In this simplified structure:

- The `weft-monorepo` contains the root `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, and `turbo.json` files.

- The `apps` directory houses the `backend` application, with its own `package.json` and a simplified file structure.

- The `domain` directory represents the shared package with its own `package.json` and a simplified file structure.

Please note that this is a basic illustration, and the actual structure may vary based on the complexity and specific requirements of your project.

## Package Manager

[pnpm](https://pnpm.io/installation) is used as the package manager, and the configuration is specified in the `package.json` file. The monorepo structure allows for efficient dependency management and sharing.

## Dockerization

The `./apps/backend/Dockerfile` creates a Docker image for the application. It leverages multi-stage builds to optimize the image size by pruning unnecessary files during the build process.

## Backend Application Configuration

The `weft-backend` package has its own `package.json` specifying dependencies, scripts for development, and build processes. **It relies on `weft-domain` as a workspace dependency.**

## Building and Running

### Prerequisites

- Docker installed on your machine
- Postgresql server running (db connection could be found in `./apps/backend/src/services/db/knex.ts`)

### Building and running the Docker Image

```bash
docker compose up --build
```

The application will be accessible on http://localhost:8000.

## Development Workflow

For local development, Turborepo is used to facilitate building and running the application. The following scripts are available:

```bash
pnpm run dev # Run the development server using turborepo.
pnpm run build # Build the application for production.
```
