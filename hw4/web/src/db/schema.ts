import { sql } from "drizzle-orm";
import {
  index,
  pgTable,
  serial,
  text,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("user_display_id").defaultRandom().notNull().unique(),
    name: varchar("user_name", { length: 50 }).notNull().unique(),
    hashPassword: varchar("hash_password").notNull(),
  },
  (table) => ({
    nameIndex: index("user_name").on(table.name),
    displayIdIndex: index("user_display_id_index").on(table.displayId),
  }),
);
export const chatRoomsTable = pgTable(
  "chatRooms",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("chatRoom_display_id").defaultRandom().notNull().unique(),
    announcMesContent: varchar("announced_mes_content"),
    lastMesSender: varchar("last_mes_sender"),
    lastMesContent: varchar("last_mes_content"),
    lastTime: timestamp("last_time")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => ({
    displayIndex: index("chatRoom_display_id_index").on(table.displayId),
    announcedIndex: index("announce_mes_index").on(table.announcMesContent),
    lastTimeIndex: index("last_time_index").on(table.lastTime),
    lastMesSenderIndes: index("last_mes_sender_index").on(table.lastMesSender),
    lastMesContentIndex: index("last_mes_content_index").on(
      table.lastMesContent,
    ),
  }),
);

export const chatRoomMembersTable = pgTable(
  "chatRoomMembers",
  {
    id: serial("id").primaryKey(),
    chatRoomDisplayId: uuid("chatRoom_display_id")
      .notNull()
      .references(() => chatRoomsTable.displayId, { onDelete: "cascade" }),
    userDisplayId: uuid("chatRoom_user_display_id")
      .notNull()
      .references(() => usersTable.displayId, { onDelete: "cascade" }),
  },
  (table) => ({
    memberDisplayIndex: index("chatRoom_user_display_Index").on(
      table.userDisplayId,
    ),
  }),
);

export const messagesTable = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    senderDisplayId: uuid("mes_user_display_id")
      .defaultRandom()
      .notNull()
      .references(() => usersTable.displayId),
    senderName: varchar("mes_user_name", { length: 50 })
      .notNull()
      .references(() => usersTable.name),
    chatRoomDisplayId: uuid("mes_chatRoom_display_id")
      .defaultRandom()
      .notNull()
      .references(() => chatRoomsTable.displayId, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    displayIndex: index("display_id_index").on(table.displayId),
    senderIdIndex: index("mes_user_display_id_index").on(table.senderDisplayId),
    chatRoomIndex: index("mes_chatRoom_display_id_index").on(
      table.chatRoomDisplayId,
    ),
  }),
);

export const removeMessageTable = pgTable(
  "removeMessage",
  {
    id: serial("id").notNull().primaryKey(),
    removeUserDisplayId: uuid("rm_user_display_id").references(
      () => usersTable.displayId,
    ),
    removeMessageDisplayId: uuid("rm_mes_display_id").references(
      () => messagesTable.displayId,
      { onDelete: "cascade" },
    ),
  },
  (table) => ({
    idIndex: index("re_id_index").on(table.id),
  }),
);
