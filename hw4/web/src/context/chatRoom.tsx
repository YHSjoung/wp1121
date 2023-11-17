"use client";

import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ChatRoomT } from "@/package/types/chatRoom";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { env } from "@/lib/env";

export type ChatRoomsContext = {
  chatRooms: ChatRoomT[];
  socket: Socket | null;
  setChatRooms: (chatRooms: ChatRoomT[]) => void;
  setMesAnn: (AnnMes: {
    messageContent: string;
    chatRoomDisplayID: string;
  }) => Promise<void>;
  buildChatRoom: (chatRoom: Omit<ChatRoomT, "timestamp">) => Promise<void>;
  fetchChatRooms: () => Promise<void>;
};

export const ChatRoomsContext = createContext<ChatRoomsContext>({
  chatRooms: [],
  setChatRooms: () => {},
  socket: null,
  buildChatRoom: async () => {},
  setMesAnn: async () => {},
  fetchChatRooms: async () => {},
});

type Props = {
  children: React.ReactNode;
};

export function ChatRoomsProvider({ children }: Props) {
  const [chatRooms, setChatRooms] = useState<ChatRoomT[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();

  const fetchChatRooms = async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      const res = await fetch("/api/chatRooms", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data?.chatRooms) {
        setChatRooms(data.chatRooms);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const initSocket = () => {
      const socket = io(env.NEXT_PUBLIC_SOCKET_URL);
      socket.on("receive_chatRoom", (newChatRoom: ChatRoomT) => {
        console.log("new chatRoom");
        setChatRooms((chatRooms) => [...chatRooms, newChatRoom]);
      });
      socket.on("receive_message", () => {
        console.log("new chatRoom");
        fetchChatRooms();
        router.refresh();
      });
      setSocket(socket);
    };
    initSocket();
    {/* eslint-disable-next-line react-hooks/exhaustive-deps */}
  }, []);

  const buildChatRoom = async (chatRoom: Omit<ChatRoomT, "name">) => {
    if (!socket) {
      alert("No socket! Please retry later.");
      return;
    }
    try {
      const res = await fetch("/api/chatRooms", {
        method: "POST",
        body: JSON.stringify(chatRoom),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.chatRoom) {
        socket.emit("build_chatRoom", data.chatRoom);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setMesAnn = async (AnnMes: {
    messageContent: string;
    chatRoomDisplayID: string;
  }) => {
    if (!socket) {
      alert("No socket! Please retry later.");
      return;
    }
    try {
      const token = localStorage.getItem("jwt-token");
      const res = await fetch("/api/chatRooms", {
        method: "PUT",
        body: JSON.stringify(AnnMes),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.message === "OK") {
        socket.emit("AnnMes", AnnMes.messageContent);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ChatRoomsContext.Provider
      value={{
        chatRooms,
        setChatRooms,
        buildChatRoom,
        socket,
        fetchChatRooms,
        setMesAnn,
      }}
    >
      {children}
    </ChatRoomsContext.Provider>
  );
}
