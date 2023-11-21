import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import type { ChatRoomT } from "@/package/types/chatRoom";
import { Message } from "@/package/types/message";

dotenv.config();

const app = express();
app.use(cors());
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  // New user has connected
  console.log("A user connected");

  // User has disconnected
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  // User has joined a chat room
  socket.on("join_room", (userOrChatRoom: string) => {
    socket.join(userOrChatRoom);
    console.log(`User joined room: ${userOrChatRoom}`)
  });

    // User has left a chat room
  socket.on("left_room", (userOrChatRoom: string) => {
    console.log(userOrChatRoom);
    socket.leave(userOrChatRoom);
    console.log(`User left room: ${userOrChatRoom}`)
  });

  // User has builded a chat room
  socket.on("build_chatRoom", (chatRoom: ChatRoomT, name: string) => {
    io.to(name).emit("receive_chatRoom", chatRoom);
    console.log(name);
  });

  // User has deleted a chat room
  socket.on("delete_chatRoom", (chatRoomId: ChatRoomT["chatRoomDisplayId"]) => {
    console.log("Delete Room")
    io.to(chatRoomId).emit("remove_chatRoom", chatRoomId);
  });

  // User has sent a message
  socket.on("send_message", (chatRoomId: ChatRoomT["chatRoomDisplayId"], newMessage: Message) => {
    io.to(chatRoomId).emit("receive_message",chatRoomId, newMessage);
  });

  // User has deleted a message
  socket.on("delete_message", (chatRoomId: ChatRoomT["chatRoomDisplayId"], messageDisplayId: Message["displayId"]) => {
    console.log("Delete Message");
    io.to(chatRoomId).emit("remove_message", messageDisplayId);
  });

  // User has setted a message announced
  socket.on("set_AnnMes", (chatRoomId: ChatRoomT["chatRoomDisplayId"], AnnMesContent: string) => {
    io.to(chatRoomId).emit("reload_AnnMes", AnnMesContent);
  });

  // User has mes socket join the chat room
  socket.on("tell_mesSocket_join_room", (userName: string, chatRoomDisplayId: string) => {
    io.to(userName).emit("join_new_chatRoom", chatRoomDisplayId);
  })
});

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log("Server runnning on http://localhost:" + port);
});
