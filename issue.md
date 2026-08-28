# Task: Initialize Backend Project with Bun, ElysiaJS, Drizzle ORM & MySQL

## Objective
Initialize and configure a modern TypeScript backend service in the current directory using **Bun** runtime, **ElysiaJS** framework, and **Drizzle ORM** connected to a **MySQL** database.

---

## Tech Stack
- **Runtime**: [Bun](https://bun.sh)
- **Web Framework**: [ElysiaJS](https://elysiajs.com)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **Database Driver**: `mysql2` (MySQL)
- **Migration & Schema Tooling**: `drizzle-kit`

---

## High-Level Implementation Steps

### 1. Project Initialization & Dependencies
- Initialize a new Bun project in the workspace (`bun init`).
- Install core runtime dependencies:
  - `elysia`
  - `drizzle-orm`
  - `mysql2`
- Install development dependencies:
  - `drizzle-kit`
  - `@types/bun`

### 2. Environment Configuration
- Create a `.env.example` and `.env` file containing database credentials:
  - `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME` (or a single `DATABASE_URL`).
- Configure `.gitignore` to exclude `.env`, `node_modules/`, and build artifacts.

### 3. Database Layer (Drizzle ORM)
- **Configuration**: Create `drizzle.config.ts` specifying MySQL dialect, schema directory, and output directory for migrations.
- **Connection**: Setup a database client instance in `src/db/index.ts` connecting `mysql2` with `drizzle-orm`.
- **Schema**: Create a basic schema in `src/db/schema.ts` (e.g., a simple `users` or `items` table) to validate the ORM pipeline.

### 4. API Server Setup (ElysiaJS)
- Create the main entry point at `src/index.ts`.
- Initialize Elysia app listening on a configurable port (default: `3000`).
- Implement basic endpoints:
  - `GET /` or `GET /health` : Health check endpoint.
  - Basic route example interacting with the database via Drizzle.

### 5. Package Scripts
Add convenient npm/bun scripts in `package.json`:
- `"dev"`: Run server in watch mode (`bun --watch src/index.ts`).
- `"start"`: Run production server (`bun src/index.ts`).
- `"db:generate"`: Generate Drizzle migrations (`drizzle-kit generate`).
- `"db:push"`: Push schema changes directly to MySQL (`drizzle-kit push`).
- `"db:studio"`: Launch Drizzle Studio UI (`drizzle-kit studio`).

---

## Acceptance Criteria
- [ ] `bun install` completes without error.
- [ ] `bun dev` starts the ElysiaJS server successfully on port 3000.
- [ ] Drizzle ORM connects to MySQL without errors when `.env` is configured.
- [ ] Schema generation/push scripts execute cleanly with `drizzle-kit`.
- [ ] Clean folder structure (`src/db/`, `src/routes/`, `src/index.ts`).
