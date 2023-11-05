import { NextResponse, type NextRequest } from "next/server";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { attendantsTable } from "@/db/schema";

const attendEventRequestSchema = z.object({
  eventId: z.number().positive(),
  userHandle: z.string().min(1).max(50),
});

type attendEventRequest = z.infer<typeof attendEventRequestSchema>;

export async function GET(request: NextRequest) {
  const data = await request.json();

  try {
    attendEventRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { eventId, userHandle } = data as attendEventRequest;

  try {
    const [exist] = await db
      .select({ dummy: sql`1` })
      .from(attendantsTable)
      .where(
        and(
          eq(attendantsTable.eventId, eventId),
          eq(attendantsTable.userHandle, userHandle),
        ),
      )
      .execute();
    return NextResponse.json({ liked: Boolean(exist) }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    attendEventRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { eventId, userHandle } = data as attendEventRequest;

  try {
    await db
      .insert(attendantsTable)
      .values({
        eventId,
        userHandle,
      })
      .onConflictDoNothing()
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const data = await request.json();

  try {
    attendEventRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { eventId, userHandle } = data as attendEventRequest;

  try {
    await db
      .delete(attendantsTable)
      .where(
        and(
          eq(attendantsTable.eventId, eventId),
          eq(attendantsTable.userHandle, userHandle),
        ),
      )
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
