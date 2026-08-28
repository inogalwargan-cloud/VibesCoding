import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { db, schema } from "./db";
import { eq } from "drizzle-orm";

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "VibesCoding API Documentation",
          version: "1.0.0",
          description: "RESTful API built with Bun, ElysiaJS, Drizzle ORM, and MySQL",
        },
      },
    })
  )
  .get("/", () => ({
    message: "Welcome to VibesCoding API",
    documentation: "/swagger",
    healthCheck: "/health",
    version: "1.0.0",
  }))
  .get("/health", () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }))
  .group("/users", (userGroup) =>
    userGroup
      .get(
        "/",
        async ({ set }) => {
          try {
            const allUsers = await db.select().from(schema.users);
            return { success: true, data: allUsers };
          } catch (error: any) {
            set.status = 500;
            return {
              success: false,
              message: "Database query failed",
              error: error?.message || "Unknown error",
            };
          }
        },
        {
          detail: {
            summary: "Get all users",
            tags: ["Users"],
          },
        }
      )
      .get(
        "/:id",
        async ({ params: { id }, set }) => {
          try {
            const [user] = await db
              .select()
              .from(schema.users)
              .where(eq(schema.users.id, id))
              .limit(1);

            if (!user) {
              set.status = 404;
              return { success: false, message: `User with id ${id} not found` };
            }

            return { success: true, data: user };
          } catch (error: any) {
            set.status = 500;
            return {
              success: false,
              message: "Database query failed",
              error: error?.message || "Unknown error",
            };
          }
        },
        {
          params: t.Object({
            id: t.Numeric(),
          }),
          detail: {
            summary: "Get user by ID",
            tags: ["Users"],
          },
        }
      )
      .post(
        "/",
        async ({ body, set }) => {
          try {
            const [result] = await db.insert(schema.users).values({
              name: body.name,
              email: body.email,
            });

            set.status = 201;
            return {
              success: true,
              message: "User created successfully",
              insertedId: result.insertId,
            };
          } catch (error: any) {
            set.status = 500;
            return {
              success: false,
              message: "Failed to create user",
              error: error?.message || "Unknown error",
            };
          }
        },
        {
          body: t.Object({
            name: t.String({ minLength: 1 }),
            email: t.String({ format: "email" }),
          }),
          detail: {
            summary: "Create a new user",
            tags: ["Users"],
          },
        }
      )
      .delete(
        "/:id",
        async ({ params: { id }, set }) => {
          try {
            const [result] = await db
              .delete(schema.users)
              .where(eq(schema.users.id, id));

            if (result.affectedRows === 0) {
              set.status = 404;
              return { success: false, message: `User with id ${id} not found` };
            }

            return { success: true, message: `User with id ${id} deleted successfully` };
          } catch (error: any) {
            set.status = 500;
            return {
              success: false,
              message: "Failed to delete user",
              error: error?.message || "Unknown error",
            };
          }
        },
        {
          params: t.Object({
            id: t.Numeric(),
          }),
          detail: {
            summary: "Delete user by ID",
            tags: ["Users"],
          },
        }
      )
  )
  .listen(port);

console.log(
  `🚀 VibesCoding API server is running at http://${app.server?.hostname}:${app.server?.port}`
);
console.log(
  `📖 Swagger documentation available at http://${app.server?.hostname}:${app.server?.port}/swagger`
);

export { app };
export type App = typeof app;
