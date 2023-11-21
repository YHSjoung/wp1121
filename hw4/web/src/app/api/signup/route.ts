import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { env } from "@/lib/env";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import jwt from "jsonwebtoken";

const loginRequestSchem = z.object({
  name: z.string().min(1).max(50),
  password: z.string().min(8).max(50),
});

type LoginRequest = z.infer<typeof loginRequestSchem>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { name, password } = data as LoginRequest;
  try {
    const [exist] = await db
      .select({ dummy: sql`1` })
      .from(usersTable)
      .where(eq(usersTable.name, name))
      .execute();

    if (exist) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }
    const hashPassword = await bcrypt.hash(password, 12);

    const [user] = await db
      .insert(usersTable)
      .values({
        name: name,
        hashPassword: hashPassword,
      })
      .returning();

    const token = jwt.sign(
      {
        userDisplayId: user.displayId,
      },
      env.NEXT_PUBLIC_JWT_SECRET,
      {
        expiresIn: env.NEXT_PUBLIC_JWT_EXPIRES_IN,
      },
    );
    return NextResponse.json(
      {
        message: "OK",
        user: {
          name: user.name,
          displayId: user.displayId,
        },
        token: token,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
