import { eq, desc, sql, ilike } from "drizzle-orm";

import AddEvent from "@/components/AddEvent";
import Event from "@/components/Event";
import NameDialog from "@/components/NameDialog";
import SearchBar from "@/components/SearchBar";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { attendantsTable, eventsTable, usersTable } from "@/db/schema";

type HomePageProps = {
  searchParams: {
    handle?: string;
    query?: string;
  };
};

// Since this is a server component, we can do some server side processing
// in the react component. This may seem crazy at first, but it's actually
// a very powerful feature. It allows us to do the data fetching and rendering
// the page in the same place. It may seem wierd to run react code on the server,
// but remember, react is not just for the browser, react-dom is. React is just
// the shadow dom and state update logic. We can use react to render anything,
// any where. There are already libraries that use react to render to the terminal,
// email, PDFs, native mobile apps, 3D objects and even videos.
export default async function Home({
  searchParams: { handle, query },
}: HomePageProps) {
  if (handle) {
    await db
      .insert(usersTable)
      .values({
        handle,
      })
      // Since handle is a unique column, we need to handle the case
      // where the user already exists. We can do this with onConflictDoUpdate
      // If the user already exists, we just update the display name
      // This way we don't have to worry about checking if the user exists
      // before inserting them.
      .onConflictDoNothing({
        target: usersTable.handle,
      })
      .execute();
  }
  // This is a good example of using subqueries, joins, and with statements
  // to get the data we need in a single query. This is a more complicated
  // query, go to src/app/tweet/[tweet_id]/page.tsx to see a simpler example.
  //
  // This is much more efficient than running separate queries for tweets,
  // likes, and liked, and then combining them in javascript. Not only is
  // the data processing done in the database, but we also only need to
  // make a single request to the database instead of three.

  // WITH clause is used to create a temporary table that can be used in the
  // main query. This is useful for creating subqueries that are used multiple
  // times in the main query. Or just to make the main query more readable.
  // read more about it here: https://orm.drizzle.team/docs/select#with-clause
  // If you're familiar with CTEs in SQL, watch this video:
  // https://planetscale.com/learn/courses/mysql-for-developers/queries/common-table-expressions-ctes
  //
  // This subquery generates the following SQL:
  // WITH likes_count AS (
  //  SELECT
  //   tweet_id,
  //   count(*) AS likes
  //   FROM likes
  //   GROUP BY tweet_id
  // )
  const attendantsSubquery = db.$with("attendants_count").as(
    db
      .select({
        eventId: attendantsTable.eventId,
        // some times we need to do some custom logic in sql
        // although drizzle-orm is very powerful, it doesn't support every possible
        // SQL query. In these cases, we can use the sql template literal tag
        // to write raw SQL queries.
        // read more about it here: https://orm.drizzle.team/docs/sql
        attendants: sql<number | null>`count(*)`
          .mapWith(Number)
          .as("attendants"),
      })
      .from(attendantsTable)
      .groupBy(attendantsTable.eventId),
  );

  // This subquery generates the following SQL:
  // WITH liked AS (
  //  SELECT
  //   tweet_id,
  //   1 AS liked
  //   FROM likes
  //   WHERE user_handle = {handle}
  //  )
  const attendedSubquery = db.$with("attended").as(
    db
      .select({
        eventId: attendantsTable.eventId,
        // this is a way to make a boolean column (kind of) in SQL
        // so when this column is joined with the tweets table, we will
        // get a constant 1 if the user liked the tweet, and null otherwise
        // we can then use the mapWith(Boolean) function to convert the
        // constant 1 to true, and null to false
        attended: sql<number>`1`.mapWith(Boolean).as("attended"),
      })
      .from(attendantsTable)
      .where(eq(attendantsTable.userHandle, handle ?? "")),
  );

  const eventsQuery = db
    .with(attendantsSubquery, attendedSubquery)
    .select({
      id: eventsTable.id,
      content: eventsTable.content,
      beginAt: eventsTable.beginAt,
      endAt: eventsTable.endAt,
      attendants: attendantsSubquery.attendants,
      attended: attendedSubquery.attended,
    })
    .from(eventsTable)
    .orderBy(desc(eventsTable.beginAt))
    // JOIN is by far the most powerful feature of relational databases
    // it allows us to combine data from multiple tables into a single query
    // read more about it here: https://orm.drizzle.team/docs/select#join
    // or watch this video:
    // https://planetscale.com/learn/courses/mysql-for-developers/queries/an-overview-of-joins
    // .innerJoin(usersTable, eq(tweetsTable.userHandle, usersTable.handle))
    .leftJoin(
      attendantsSubquery,
      eq(eventsTable.id, attendantsSubquery.eventId),
    )
    .leftJoin(attendedSubquery, eq(eventsTable.id, attendedSubquery.eventId));

  if (query != null) {
    eventsQuery.where(ilike(eventsTable.content, `%${query}%`));
  }

  const events = await eventsQuery.execute();

  return (
    <>
      <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
        <h1 className="mb-2 bg-white px-4 text-xl font-bold">Home</h1>
        <div className="w-full px-4 pt-3">
          <AddEvent />
          <SearchBar />
        </div>
        <Separator />
        {events.map((event) => (
          <Event
            key={event.id}
            id={event.id}
            handle={handle}
            content={event.content}
            attendants={event.attendants}
            attended={event.attended}
            beginAt={event.beginAt!}
            endAt={event.endAt!}
          />
        ))}
      </div>
      <NameDialog />
    </>
  );
}
