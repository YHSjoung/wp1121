import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { talksTable } from "@/db/schema";

// zod is a library that helps us validate data at runtime
// it's useful for validating data coming from the client,
// since typescript only validates data at compile time.
// zod's schema syntax is pretty intuitive,
// read more about zod here: https://zod.dev/
const postTalkRequestSchema = z.object({
  handle: z.string().min(1).max(50),
  content: z.string().min(1).max(280),
  replyToEventId: z.number(),
});

// you can use z.infer to get the typescript type from a zod schema
type PostTalkRequest = z.infer<typeof postTalkRequestSchema>;

// This API handler file would be trigger by http requests to /api/likes
// POST requests would be handled by the POST function
// GET requests would be handled by the GET function
// etc.
// read more about Next.js API routes here:
// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    // parse will throw an error if the data doesn't match the schema
    // if that happens, we return a 400 error
    postTalkRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // the `data` variable is now guaranteed to be of type PostTweetRequest
  // but the compiler doesn't know that, so we have to cast it with `as`
  const { handle, content, replyToEventId } = data as PostTalkRequest;

  try {
    // This piece of code runs the following SQL query:
    // INSERT INTO tweets (
    //  user_handle,
    //  content,
    //  reply_to_tweet_id
    // ) VALUES (
    //  {handle},
    //  {content},
    //  {replyToTweetId}
    // )
    await db
      .insert(talksTable)
      .values({
        userHandle: handle,
        content,
        replyToEventId,
      })
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
