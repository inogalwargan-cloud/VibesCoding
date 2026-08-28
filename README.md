# VibesCoding Backend

Modern backend service built with [Bun](https://bun.sh), [ElysiaJS](https://elysiajs.com), [Drizzle ORM](https://orm.drizzle.team), and [MySQL](https://www.mysql.com).

---

## Getting Started

### 1. Install Dependencies
```bash
bun install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your MySQL database credentials:
```bash
cp .env.example .env
```

### 3. Database Migrations
Generate and apply migrations using Drizzle Kit:
```bash
# Generate migration SQL
bun run db:generate

# Push schema directly to MySQL database
bun run db:push

# Open Drizzle Studio in browser
bun run db:studio
```

### 4. Running the Server
```bash
# Development mode with hot-reload
bun run dev

# Production mode
bun run start
```

### 5. Running Tests
```bash
bun test
```

---

## API Endpoints

- **`GET /`** : API Overview and metadata
- **`GET /health`** : Health check endpoint
- **`GET /swagger`** : Interactive Swagger / OpenAPI documentation
- **`GET /users`** : List all users
- **`POST /users`** : Create a new user (`{ name: string, email: string }`)
- **`GET /users/:id`** : Get a user by ID
- **`DELETE /users/:id`** : Delete a user by ID
