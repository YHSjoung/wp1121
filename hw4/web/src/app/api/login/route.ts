import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import bcrypt from "bcrypt";
import { env } from "@/lib/env";
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
    const [user] = await db
      .select({
        hashPassword: usersTable.hashPassword,
        displayId: usersTable.displayId,
        name: usersTable.name,
      })
      .from(usersTable)
      .where(eq(usersTable.name, name))
      .execute();
    if (!name) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.hashPassword);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
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
