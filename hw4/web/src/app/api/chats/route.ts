import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import jwt from "jsonwebtoken";
import { env } from "@/lib/env";
import type { User } from "@/package/types/user";
import { chatRoomsTable, messagesTable, removeMessageTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const DeleteMessageSchema = z.object({
  messageDisplayId: z.string().min(1).max(50),
  chatRoomDisplayID: z.string().min(1).max(50),
});
type DeleteMessageRequest = z.infer<typeof DeleteMessageSchema>;

const RemoveMessageSchema = z.object({
  messageDisplayId: z.string().min(1).max(50),
});
type RemoveMessageRequest = z.infer<typeof RemoveMessageSchema>;

const postMessageSchema = z.object({
  content: z.string().min(1).max(500),
  senderName: z.string().min(1).max(50),
  chatRoomId: z.string().min(1).max(50),
});
type PostMessageRequest = z.infer<typeof postMessageSchema>;

export async function GET(request: NextRequest) {
  const chatRoom = request.nextUrl.searchParams.get("chatRoom");
  console.log(chatRoom);
  const token = request.headers.get("authorization")?.split(" ")[1];
  const verified = jwt.verify(token!, env.NEXT_PUBLIC_JWT_SECRET!);
  console.log("verified", verified);
  const userDisplayId = (verified as { userDisplayId: User["displayId"] })
    .userDisplayId;

  const chatRoomMes = await db
    .select({
      displayId: messagesTable.displayId,
      senderName: messagesTable.senderName,
      content: messagesTable.content,
      createdAt: messagesTable.createdAt,
    })
    .from(messagesTable)
    .where(eq(messagesTable.chatRoomDisplayId, chatRoom!))
    .orderBy(messagesTable.createdAt)
    .execute();

  const removeMessages = await db
    .select({
      removeMessageDisplayId: removeMessageTable.removeMessageDisplayId,
    })
    .from(removeMessageTable)
    .where(eq(removeMessageTable.removeUserDisplayId, userDisplayId))
    .execute();
  console.log(removeMessages);
  return NextResponse.json(
    {
      messages: chatRoomMes,
      removeMessages: removeMessages,
    },
    { status: 200 },
  );
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log(data);
  const token = request.headers.get("authorization")?.split(" ")[1];
  const verified = jwt.verify(token!, env.NEXT_PUBLIC_JWT_SECRET!);
  console.log("verified", verified);
  const userDisplayId = (verified as { userDisplayId: User["displayId"] })
    .userDisplayId;
  console.log(userDisplayId);

  try {
    postMessageSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { content, chatRoomId, senderName } = data as PostMessageRequest;
  try {
    const res = await db
      .insert(messagesTable)
      .values({
        senderDisplayId: userDisplayId,
        senderName: senderName,
        chatRoomDisplayId: chatRoomId,
        content: content,
      })
      .returning()
      .execute();

    await db
      .update(chatRoomsTable)
      .set({
        displayId: chatRoomId,
        lastMesContent: content,
        lastMesSender: senderName,
        lastTime: res[0].createdAt!,
      })
      .where(eq(chatRoomsTable.displayId, chatRoomId))
      .execute();

    return NextResponse.json(
      {
        message: {
          displayId: res[0].displayId,
          content: res[0].content,
          senderName: res[0].senderName,
          createdAt: res[0].createdAt,
        },
        chatRoomId: {
          chatRoomDisplayId: res[0].chatRoomDisplayId,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const data = await request.json();
  console.log(data);
  const token = request.headers.get("authorization")?.split(" ")[1];
  const verified = jwt.verify(token!, env.NEXT_PUBLIC_JWT_SECRET!);
  console.log("verified", verified);
  const userDisplayId = (verified as { userDisplayId: User["displayId"] })
    .userDisplayId;
  console.log(userDisplayId);

  try {
    DeleteMessageSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { messageDisplayId, chatRoomDisplayID } = data as DeleteMessageRequest;
  try {
    await db
      .delete(messagesTable)
      .where(eq(messagesTable.displayId, messageDisplayId))
      .returning()
      .execute();

    const [latestMesSub] = await db
      .select({
        lastMesDisplayId: messagesTable.displayId,
        lastMesContent: messagesTable.content,
        lastMesSender: messagesTable.senderName,
      })
      .from(messagesTable)
      .where(eq(messagesTable.chatRoomDisplayId, chatRoomDisplayID))
      .orderBy(desc(messagesTable.createdAt))
      .limit(1)
      .execute();

    await db
      .update(chatRoomsTable)
      .set({
        displayId: chatRoomDisplayID,
        lastMesContent: latestMesSub.lastMesContent,
        lastMesSender: latestMesSub.lastMesSender,
      })
      .where(eq(chatRoomsTable.displayId, chatRoomDisplayID))
      .execute();

    return NextResponse.json(
      {
        message: "OK",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  console.log(data);
  const token = request.headers.get("authorization")?.split(" ")[1];
  const verified = jwt.verify(token!, env.NEXT_PUBLIC_JWT_SECRET!);
  console.log("verified", verified);
  const userDisplayId = (verified as { userDisplayId: User["displayId"] })
    .userDisplayId;
  console.log(userDisplayId);

  try {
    RemoveMessageSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { messageDisplayId } = data as RemoveMessageRequest;
  console.log(messageDisplayId);

  try {
    await db
      .insert(removeMessageTable)
      .values({
        removeUserDisplayId: userDisplayId,
        removeMessageDisplayId: messageDisplayId,
      })
      .execute();

    return NextResponse.json(
      {
        message: "OK",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
