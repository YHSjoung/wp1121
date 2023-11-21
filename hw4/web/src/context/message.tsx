"use client";
import { createContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Message } from "@/package/types/message";
import type { ChatRoomT } from "@/package/types/chatRoom";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { env } from "@/lib/env";

export type MessagesContext = {
  chatRoom: ChatRoomT | undefined;
  setChatRoom: (chatRoom: ChatRoomT) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  annMes: string | undefined;
  setAnnMes: (AnnMesContent: string | undefined) => void;
  sendMessage: (message: Omit<Message, "displayId">) => Promise<void>;
  deleteMessage: (DeleteMes: {
    messageDisplayId: string;
    chatRoomDisplayID: string;
  }) => Promise<void>;
  removeMessage: (messageDisplayId: string) => Promise<void>;
  fetchMessages: (chatRoom: string) => void;
  socket: Socket | null;
};

export const MessagesContext = createContext<MessagesContext>({
  chatRoom: undefined,
  messages: [],
  annMes: undefined,
  setChatRoom: () => {},
  setMessages: () => {},
  setAnnMes: () => {},
  socket: null,
  sendMessage: async () => {},
  deleteMessage: async () => {},
  removeMessage: async () => {},
  fetchMessages: async () => {},
});

type Props = {
  children: React.ReactNode;
};

export function MessagesProvider({ children }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRoom, setChatRoom] = useState<ChatRoomT>();
  const [annMes, setAnnMes] = useState<string | undefined>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const searchParams = useSearchParams();
  const userName = searchParams.toString().split("=")[1];
  const token = localStorage.getItem("jwt-token");

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const fetchMessages = async (chatRoom: string) => {
    if (chatRoom === null || !socket) {
      return;
    }
    try {
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
        const messageDisplayIdShow = new Set(
          data.removeMessages.map(
            (message: { removeMessageDisplayId: string }) =>
              message.removeMessageDisplayId,
          ),
        );
        const showMessage = data.messages.filter(
          (message: Message) => !messageDisplayIdShow.has(message.displayId),
        );
        setMessages(showMessage);
        socket.emit("join_room", chatRoom);
        console.log(messageDisplayIdShow);
        console.log("uiuiuiui");
      }
      console.log(data.messages);
      console.log("aabbccd");
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (message: Omit<Message, "displayId">) => {
    if (!socket) {
      alert("No socket! Please retry later.");
      return;
    }
    try {
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
        socket.emit(
          "send_message",
          data.chatRoomId.chatRoomDisplayId,
          data.message,
        );
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
      const res = await fetch("/api/chats", {
        method: "DELETE",
        body: JSON.stringify(DeleteMes),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      await res.json();
      socket.emit(
        "delete_message",
        DeleteMes.chatRoomDisplayID,
        DeleteMes.messageDisplayId,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const removeMessage = async (messageDisplayId: string) => {
    if (!socket) {
      alert("No socket! Please retry later.");
      return;
    }
    try {
      await fetch("/api/chats", {
        method: "PUT",
        body: JSON.stringify({ messageDisplayId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(
        messages.filter((message) => message.displayId !== messageDisplayId),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const initSocket = () => {
      const socket = io(env.NEXT_PUBLIC_SOCKET_URL);
      socket.emit("join_room", userName);

      // handle user add chat room with other
      socket.on("join_new_chatRoom", (ChatRoomDisplay: string) => {
        console.log("join new chat room");
        socket.emit("join_room", ChatRoomDisplay);
      });

      // handle other add chat room with you
      socket.on("receive_chatRoom", (newChatRoom: ChatRoomT) => {
        socket.emit("join_room", newChatRoom.chatRoomDisplayId);
      });

      // push the new message on the chat room
      socket.on(
        "receive_message",
        (_chatRoomId: string, newMessage: Message) => {
          console.log("new message");
          setMessages((messages) => [...messages, newMessage]);
        },
      );
      // delete the message on the chat room
      socket.on("remove_message", (messageDisplayId) => {
        console.log("delete_message");
        setMessages((messages) =>
          messages.filter((message) => message.displayId !== messageDisplayId),
        );
      });
      // set the announced message
      socket.on("reload_AnnMes", (AnnMesContent) => {
        console.log("reload_AnnMes");
        setAnnMes(AnnMesContent);
      });

      setSocket(socket);
    };
    initSocket();
    {/* eslint-disable-next-line react-hooks/exhaustive-deps */}
  }, []);

  useEffect(() => {
    if (chatRoom) {
      fetchMessages(chatRoom.chatRoomDisplayId);
    }
    {/* eslint-disable-next-line react-hooks/exhaustive-deps */}
  }, [chatRoom]);

  return (
    <MessagesContext.Provider
      value={{
        messages,
        setMessages,
        annMes,
        setAnnMes,
        chatRoom,
        setChatRoom,
        sendMessage,
        fetchMessages,
        deleteMessage,
        removeMessage,
        socket,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}
