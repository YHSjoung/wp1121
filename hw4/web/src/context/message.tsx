"use client";
import { createContext, useEffect, useState } from "react";
import type { Message } from "@/package/types/message";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { env } from "@/lib/env";

export type MessagesContext = {
  chatRoom: string | undefined;
  chatRoomName: string | undefined;
  annMes: string | undefined;
  setChatRoomName: (chatRoomName: string) => void;
  setChatRoom: (chatRoom: string) => void;
  setAnnMes: (content: string) => void;
  messages: Message[];
  socket: Socket | null;
  setMessages: (messages: Message[]) => void;
  sendMessage: (message: Message) => Promise<void>;
  deleteMessage: (DeleteMes: {
    messageDisplayId: string;
    chatRoomDisplayID: string;
  }) => Promise<void>;
  fetchMessages: (chatRoom: string) => void;
};

export const MessagesContext = createContext<MessagesContext>({
  chatRoom: "",
  chatRoomName: "",
  annMes: "",
  messages: [],
  setChatRoom: () => {},
  setChatRoomName: () => {},
  setAnnMes: () => {},
  setMessages: () => {},
  socket: null,
  sendMessage: async () => {},
  deleteMessage: async () => {},
  fetchMessages: async () => {},
});

type Props = {
  children: React.ReactNode;
};

export function MessagesProvider({ children }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRoom, setChatRoom] = useState<string>("");
  const [chatRoomName, setChatRoomName] = useState<string>("");
  const [annMes, setAnnMes] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    console.log(messages);
  }, [messages]);
  const fetchMessages = async (chatRoom: string) => {
    if (chatRoom === null) {
      return;
    }
    try {
      const token = localStorage.getItem("jwt-token");
      console.log(chatRoom);
      const res = await fetch(`/api/chats/?chatRoom=${chatRoom}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data?.messages) {
        setMessages(data.messages);
        console.log(data.messages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const initSocket = () => {
      const socket = io(env.NEXT_PUBLIC_SOCKET_URL);
      socket.on("receive_message", (newMessage: Message) => {
        console.log("new message");
        setMessages((messages) => [...messages, newMessage]);
      });
      socket.on("delete_message", () => {
        console.log("delete_message");
        setChatRoom(chatRoom);
      });
      socket.on("reload_AnnMes", (chatRoomDisplayID) => {
        console.log("reload_AnnMes");
        setAnnMes(chatRoomDisplayID);
      });
      setSocket(socket);
    };
    initSocket();
    {/* eslint-disable-next-line react-hooks/exhaustive-deps */}
  }, []);

  useEffect(() => {
    fetchMessages(chatRoom);
  }, [chatRoom]);

  const sendMessage = async (message: Message) => {
    if (!socket) {
      alert("No socket! Please retry later.");
      return;
    }
    try {
      const token = localStorage.getItem("jwt-token");
      const res = await fetch("/api/chats", {
        method: "POST",
        body: JSON.stringify(message),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data?.message) {
        socket.emit("send_message", data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMessage = async (DeleteMes: {
    messageDisplayId: string;
    chatRoomDisplayID: string;
  }) => {
    if (!socket) {
      alert("No socket! Please retry later.");
      return;
    }
    try {
      const token = localStorage.getItem("jwt-token");
      const res = await fetch("/api/chats", {
        method: "DELETE",
        body: JSON.stringify(DeleteMes),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const message = true;
      if (data.ok) {
        socket.emit("delete_message", message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MessagesContext.Provider
      value={{
        messages,
        setMessages,
        sendMessage,
        socket,
        chatRoom,
        setChatRoom,
        fetchMessages,
        deleteMessage,
        annMes,
        setAnnMes,
        chatRoomName,
        setChatRoomName,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}
