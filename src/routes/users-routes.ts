import { Elysia, t } from "elysia";
import { registerUser, DuplicateEmailError } from "../services/users-service";

export const usersRoutes = new Elysia({ prefix: "/api/users" }).post(
  "/",
  async ({ body, set }) => {
    try {
      const newUser = await registerUser(body);

      set.status = 201;
      return {
        status: "success",
        message: "User registered successfully",
        data: newUser,
      };
    } catch (error: any) {
      if (error instanceof DuplicateEmailError || error?.message === "Email already registered") {
        set.status = 400;
        return {
          status: "error",
          message: "Email already registered",
          data: null,
        };
      }

      set.status = 500;
      return {
        status: "error",
        message: error?.message || "Internal server error",
        data: null,
      };
    }
  },
  {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 1 }),
    }),
    detail: {
      summary: "Register new user",
      tags: ["Authentication / Users"],
    },
  }
);
