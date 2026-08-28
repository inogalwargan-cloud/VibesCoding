import { db, schema } from "../db";
import { eq } from "drizzle-orm";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisteredUserData {
  id: number;
  name: string;
  email: string;
  created_at: string | Date;
}

export class DuplicateEmailError extends Error {
  constructor(message = "Email already registered") {
    super(message);
    this.name = "DuplicateEmailError";
  }
}

export async function registerUser(input: RegisterUserInput): Promise<RegisteredUserData> {
  const { name, email, password } = input;

  // 1. Check if user with this email already exists
  const existingUser = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new DuplicateEmailError("Email already registered");
  }

  // 2. Hash password using Bun's native bcrypt implementation
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  // 3. Insert record into database
  const [result] = await db.insert(schema.users).values({
    name,
    email,
    password: hashedPassword,
  });

  const newId = Number(result.insertId);

  // 4. Fetch created record to get exact timestamp or construct return object
  const [createdUser] = await db
    .select({
      id: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
      createdAt: schema.users.createdAt,
    })
    .from(schema.users)
    .where(eq(schema.users.id, newId))
    .limit(1);

  return {
    id: createdUser?.id ?? newId,
    name: createdUser?.name ?? name,
    email: createdUser?.email ?? email,
    created_at: createdUser?.createdAt ? new Date(createdUser.createdAt).toISOString() : new Date().toISOString(),
  };
}
