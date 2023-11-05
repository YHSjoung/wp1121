import Link from "next/link";
import { redirect } from "next/navigation";

import { eq, sql, and } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";

import AttendButton from "@/components/AttendButton";
import ReplyInput from "@/components/ReplyInput";
import Talk from "@/components/Talk";
import TimeText from "@/components/TimeText";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import {
  attendantsTable,
  eventsTable,
  usersTable,
  talksTable,
} from "@/db/schema";

type EventPageProps = {
  params: {
    // this came from the file name: [tweet_id].tsx
    event_id: string;
  };
  searchParams: {
    // this came from the query string: ?username=madmaxieee
    handle?: string;
  };
};

// these two fields are always available in the props object of a page component
export default async function Eventpage({
  params: { event_id },
  searchParams: { handle },
}: EventPageProps) {
  const event_id_num = parseInt(event_id);

  const errorRedirect = () => {
    const params = new URLSearchParams();
    handle && params.set("handle", handle);
    redirect(`/?${params.toString()}`);
  };

  if (isNaN(event_id_num)) {
    errorRedirect();
  }

  // This is the easiest way to get the tweet data
  // you can run separate queries for the tweet data, likes, and liked
  // and then combine them in javascript.
  //
  // This gets things done for now, but it's not the best way to do it
  // relational databases are highly optimized for this kind of thing
  // we should always try to do as much as possible in the database.

  // This piece of code runs the following SQL query on the tweets table:
  // SELECT
  //   id,
  //   content,
  //   user_handle,
  //   created_at
  //   FROM tweets
  //   WHERE id = {tweet_id_num};
  const [eventData] = await db
    .select({
      id: eventsTable.id,
      content: eventsTable.content,
      beginAt: eventsTable.beginAt,
      endAt: eventsTable.endAt,
    })
    .from(eventsTable)
    .where(eq(eventsTable.id, event_id_num))
    .execute();

  // Although typescript thinks tweetData is not undefined, it is possible
  // that tweetData is undefined. This can happen if the tweet doesn't exist.
  // Thus the destructuring assignment above is not safe. We need to check
  // if tweetData is undefined before using it.
  if (!eventData) {
    errorRedirect();
  }

  // This piece of code runs the following SQL query on the tweets table:
  // SELECT
  //  id,
  //  FROM likes
  //  WHERE tweet_id = {tweet_id_num};
  // Since we only need the number of likes, we don't actually need to select
  // the id here, we can select a constant 1 instead. Or even better, we can
  // use the count aggregate function to count the number of rows in the table.
  // This is what we do in the next code block in likesSubquery.
  const attendants = await db
    .select({
      id: attendantsTable.id,
    })
    .from(attendantsTable)
    .where(eq(attendantsTable.eventId, event_id_num))
    .execute();

  const numAttendants = attendants.length;

  const [attendedResult] = await db
    .select({
      attended: sql<number>`1`.mapWith(Boolean).as("attended"),
    })
    .from(attendantsTable)
    .where(
      and(
        eq(attendantsTable.eventId, event_id_num),
        eq(attendantsTable.userHandle, handle ?? ""),
      ),
    )
    .execute();

  const attended = !attendedResult ? false : true;

  // const attendantsSubquery = db.$with("attendants_count").as(
  //   db
  //     .select({
  //       eventId: attendantsTable.eventId,
  //       // some times we need to do some custom logic in sql
  //       // although drizzle-orm is very powerful, it doesn't support every possible
  //       // SQL query. In these cases, we can use the sql template literal tag
  //       // to write raw SQL queries.
  //       // read more about it here: https://orm.drizzle.team/docs/sql
  //       attendants: sql<number | null>`count(*)`.mapWith(Number).as("attendants"),
  //     })
  //     .from(attendantsTable)
  //     .groupBy(attendantsTable.eventId),
  // );

  // const attendedSubquery = db.$with("attended").as(
  //   db
  //     .select({
  //       eventId: attendantsTable.eventId,
  //       // this is a way to make a boolean column (kind of) in SQL
  //       // so when this column is joined with the tweets table, we will
  //       // get a constant 1 if the user liked the tweet, and null otherwise
  //       // we can then use the mapWith(Boolean) function to convert the
  //       // constant 1 to true, and null to false
  //       attended: sql<number>`1`.mapWith(Boolean).as("attended"),
  //     })
  //     .from(attendantsTable)
  //     .where(eq(attendantsTable.userHandle, handle ?? "")),
  // );

  const talks = await db
    .select({
      id: talksTable.id,
      content: talksTable.content,
      authorhandle: usersTable.handle,
      createdAt: talksTable.createdAt,
    })
    .from(talksTable)
    .where(eq(talksTable.replyToEventId, event_id_num))
    .orderBy(talksTable.createdAt)
    .innerJoin(usersTable, eq(talksTable.userHandle, usersTable.handle))
    .execute();

  return (
    <>
      <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
        <div className="mb-2 flex items-center gap-8 px-4">
          <Link href={{ pathname: "/", query: { handle } }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold">Event</h1>
        </div>
        <div className="mb-4 flex justify-between ">
          <div className="flex flex-col gap-2 px-4 pt-3">
            <article className="my-3 whitespace-pre-wrap break-words text-4xl">
              {eventData.content}
            </article>
            <time className="flex items-end text-lg">
              <div className="mx-2 text-lg text-gray-500">{`from  `}</div>
              <TimeText date={eventData.beginAt} format="YYYY-MM-DD HH" />
              <div className="mx-2 text-lg text-gray-500 ">{`  to  `}</div>
              <TimeText date={eventData.endAt} format="YYYY-MM-DD HH" />
            </time>
          </div>
          <div className="my-7 text-gray-400">
            <AttendButton
              initialAttendants={numAttendants}
              initialAttended={attended}
              eventId={event_id_num}
              handle={handle}
            />
          </div>
        </div>
        <Separator />
        {talks.map((talk) => (
          <Talk
            key={talk.id}
            authorHandle={talk.authorhandle}
            content={talk.content}
            createdAt={talk.createdAt!}
          />
        ))}
        <ReplyInput replyToEventId={eventData.id} attended={attended} />
      </div>
    </>
  );
}
