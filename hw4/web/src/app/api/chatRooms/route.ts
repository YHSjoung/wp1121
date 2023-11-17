import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { eq, desc, ilike, and, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
  usersTable,
  chatRoomsTable,
  messagesTable,
  chatRoomMembersTable,
} from "@/db/schema";
import type { User } from "@/package/types/user";
import { env } from "@/lib/env";
import jwt from "jsonwebtoken";

const postChatRoomSchema = z.object({
  name: z.string().min(1).max(50),
});
type PostChatRoomRequest = z.infer<typeof postChatRoomSchema>;

const AnnMessageSchema = z.object({
  messageContent: z.string().min(1).max(50),
  chatRoomDisplayID: z.string().min(1).max(50),
});
type AnnMessageRequest = z.infer<typeof AnnMessageSchema>;

const DeleteChatRoomSchema = z.object({
  chatRoomDisplayID: z.string().min(1).max(50),
});
type DeleteChatRoomRequest = z.infer<typeof DeleteChatRoomSchema>;

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("keyword");

  const token = request.headers.get("authorization")?.split(" ")[1];
  const verified = jwt.verify(token!, env.NEXT_PUBLIC_JWT_SECRET!);
  console.log("verified", verified);
  const userDisplayId = (verified as { userDisplayId: User["displayId"] })
    .userDisplayId;
  console.log(userDisplayId);

  const chatRoomsIdSubquery = db.$with("chat_room_id").as(
    db
      .select({
        chatRoomsDisplayId: chatRoomMembersTable.chatRoomDisplayId,
      })
      .from(chatRoomMembersTable)
      .where(eq(chatRoomMembersTable.userDisplayId, userDisplayId)),
  );

  const objectDisplayIdSubquery = db.$with("chat_room_object_name").as(
    db
      .with(chatRoomsIdSubquery)
      .select({
        chatRoomObjectDisplayId: chatRoomMembersTable.userDisplayId,
        chatRoomDisplayId: chatRoomMembersTable.chatRoomDisplayId,
      })
      .from(chatRoomMembersTable)
      .innerJoin(
        chatRoomsIdSubquery,
        and(
          eq(
            chatRoomsIdSubquery.chatRoomsDisplayId,
            chatRoomMembersTable.chatRoomDisplayId,
          ),
          ne(chatRoomMembersTable.userDisplayId, userDisplayId),
        ),
      ),
  );

  const objectNameSub = db.$with("object_name").as(
    db
      .with(objectDisplayIdSubquery)
      .select({
        chatRoomObjectName: usersTable.name,
        chatRoomObjectDisplayId:
          objectDisplayIdSubquery.chatRoomObjectDisplayId,
        chatRoomDisplayId: objectDisplayIdSubquery.chatRoomDisplayId,
      })
      .from(usersTable)
      .innerJoin(
        objectDisplayIdSubquery,
        eq(
          objectDisplayIdSubquery.chatRoomObjectDisplayId,
          usersTable.displayId,
        ),
      ),
  );

  const lastMesSubquery = db.$with("last_mes").as(
    db
      .with(chatRoomsIdSubquery)
      .select({
        lastMesDisplayId: chatRoomsTable.lastMesId,
        lastMesChatRoomsDisplayId: chatRoomsTable.displayId,
        lastMesContent: chatRoomsTable.lastMesContent,
        annMesContent: chatRoomsTable.announcMesContent,
      })
      .from(chatRoomsTable)
      .innerJoin(
        chatRoomsIdSubquery,
        eq(chatRoomsTable.displayId, chatRoomsIdSubquery.chatRoomsDisplayId),
      ),
  );

  const completeLastMesSubquery = db.$with("completed_las_mes").as(
    db
      .with(lastMesSubquery, objectNameSub)
      .select({
        lasMesChatRoomDisplayId: lastMesSubquery.lastMesChatRoomsDisplayId,
        name: objectNameSub.chatRoomObjectName,
        senderName: messagesTable.senderName,
        createdAt: messagesTable.createdAt,
      })
      .from(messagesTable)
      .innerJoin(
        lastMesSubquery,
        eq(messagesTable.displayId, lastMesSubquery.lastMesDisplayId),
      )
      .innerJoin(
        objectNameSub,
        eq(messagesTable.chatRoomDisplayId, objectNameSub.chatRoomDisplayId),
      ),
  );

  const completeLastMesSubquer = await db
    .with(lastMesSubquery, objectNameSub)
    .select({
      lasMesChatRoomDisplayId: lastMesSubquery.lastMesChatRoomsDisplayId,
      name: objectNameSub.chatRoomObjectName,
      senderName: messagesTable.senderName,
      createdAt: messagesTable.createdAt,
    })
    .from(messagesTable)
    .innerJoin(
      lastMesSubquery,
      eq(messagesTable.displayId, lastMesSubquery.lastMesDisplayId),
    )
    .innerJoin(
      objectNameSub,
      eq(messagesTable.chatRoomDisplayId, objectNameSub.chatRoomDisplayId),
    )
    .execute();

  console.log(completeLastMesSubquer);
  const chatRoomsQuery = db
    .with(lastMesSubquery, completeLastMesSubquery)
    .select({
      displayId: lastMesSubquery.lastMesChatRoomsDisplayId,
      name: completeLastMesSubquery.name,
      senderName: completeLastMesSubquery.senderName,
      content: lastMesSubquery.lastMesContent,
      createdAt: completeLastMesSubquery.createdAt,
      annMesContent: lastMesSubquery.annMesContent,
    })
    .from(completeLastMesSubquery)
    .orderBy(desc(completeLastMesSubquery.createdAt))
    .rightJoin(
      lastMesSubquery,
      eq(
        completeLastMesSubquery.lasMesChatRoomDisplayId,
        lastMesSubquery.lastMesChatRoomsDisplayId,
      ),
    );

  if (keyword !== null) {
    chatRoomsQuery.where(ilike(completeLastMesSubquery.name, `%${keyword}%`));
    const searchChatRooms = await db
      .select({
        userDisplayId: usersTable.displayId,
        userName: usersTable.name,
      })
      .from(usersTable)
      .where(ilike(usersTable.name, `%${keyword}%`))
      .execute();

    const chatRooms = await chatRoomsQuery.execute();
    console.log(chatRooms);
    return NextResponse.json(
      {
        chatRooms,
        searchChatRooms,
        userDisplayId,
      },
      { status: 200 },
    );
  }

  const chatRooms = await chatRoomsQuery.execute();
  console.log("KKK");
  console.log(chatRooms);
  console.log("jjj");
  return NextResponse.json(
    {
      chatRooms,
    },
    { status: 200 },
  );
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  const verified = jwt.verify(token!, env.NEXT_PUBLIC_JWT_SECRET!);
  console.log("verified", verified);
  const userDisplayId = (verified as { userDisplayId: User["displayId"] })
    .userDisplayId;
  console.log(userDisplayId);

  const data = await request.json();
  try {
    postChatRoomSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { name } = data as PostChatRoomRequest;
  try {
    const chatRoomsIdSubquery = db.$with("chat_room_id").as(
      db
        .select({
          chatRoomsDisplayId: chatRoomMembersTable.chatRoomDisplayId,
        })
        .from(chatRoomMembersTable)
        .where(eq(chatRoomMembersTable.userDisplayId, userDisplayId)),
    );

    const objectDisplayIdSubquery = db.$with("chat_room_object_name").as(
      db
        .with(chatRoomsIdSubquery)
        .select({
          chatRoomObjectDisplayId: chatRoomMembersTable.userDisplayId,
        })
        .from(chatRoomMembersTable)
        .innerJoin(
          chatRoomsIdSubquery,
          and(
            eq(
              chatRoomsIdSubquery.chatRoomsDisplayId,
              chatRoomMembersTable.chatRoomDisplayId,
            ),
            ne(chatRoomsIdSubquery.chatRoomsDisplayId, userDisplayId),
          ),
        ),
    );

    const objectName = await db
      .with(objectDisplayIdSubquery)
      .select({
        chatRoomObjectName: usersTable.name,
      })
      .from(usersTable)
      .innerJoin(
        objectDisplayIdSubquery,
        eq(
          objectDisplayIdSubquery.chatRoomObjectDisplayId,
          usersTable.displayId,
        ),
      )
      .execute();

    // const chatRoomsNameSubquery = await db
    //   .with(chatRoomsIdSubquery)
    //   .select({
    //     chatRoomName: chatRoomsTable.name,
    //   })
    //   .from(chatRoomsTable)
    //   .innerJoin(chatRoomsIdSubquery,eq(chatRoomsTable.displayId,chatRoomsIdSubquery.chatRoomsDisplayId))
    //   .execute();

    const chatRoomNameArray = objectName.map(
      (chatRoom) => chatRoom.chatRoomObjectName,
    );
    if (chatRoomNameArray.includes(name)) {
      return NextResponse.json(
        { message: "Already had the chat room", displayId: null },
        { status: 200 },
      );
    }

    const chatRoomResult = await db
      .insert(chatRoomsTable)
      .values({
        lastMesContent: "",
      })
      .returning()
      .execute();

    const chatRoomDisplayId = chatRoomResult[0].displayId;
    const objectDisplayId = await db
      .select({
        objectDisplayId: usersTable.displayId,
      })
      .from(usersTable)
      .where(eq(usersTable.name, name))
      .execute();

    await db
      .insert(chatRoomMembersTable)
      .values({
        chatRoomDisplayId: chatRoomDisplayId,
        userDisplayId: userDisplayId,
      })
      .execute();

    await db
      .insert(chatRoomMembersTable)
      .values({
        chatRoomDisplayId: chatRoomDisplayId,
        userDisplayId: objectDisplayId[0].objectDisplayId,
      })
      .execute();

    return NextResponse.json(
      { message: "OK", displayId: chatRoomDisplayId },
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
  const token = request.headers.get("authorization")?.split(" ")[1];
  const verified = jwt.verify(token!, env.NEXT_PUBLIC_JWT_SECRET!);
  console.log("verified", verified);
  const userDisplayId = (verified as { userDisplayId: User["displayId"] })
    .userDisplayId;
  console.log(userDisplayId);

  const data = await request.json();
  try {
    AnnMessageSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { messageContent, chatRoomDisplayID } = data as AnnMessageRequest;
  try {
    await db
      .update(chatRoomsTable)
      .set({
        announcMesContent: messageContent,
      })
      .where(eq(chatRoomsTable.displayId, chatRoomDisplayID));

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  const verified = jwt.verify(token!, env.NEXT_PUBLIC_JWT_SECRET!);
  console.log("verified", verified);
  // const userDisplayId = (verified as { userDisplayId: User["displayId"]}).userDisplayId;
  // console.log(userDisplayId);
  const data = await request.json();
  try {
    DeleteChatRoomSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { chatRoomDisplayID } = data as DeleteChatRoomRequest;
  try {
    await db
      .delete(chatRoomsTable)
      .where(eq(chatRoomsTable.displayId, chatRoomDisplayID));

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
