"use client";

import { createContext, useEffect, useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
import type { ChatRoomT } from "@/package/types/chatRoom";
import type { Message } from "@/package/types/message";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { env } from "@/lib/env";

import { MessagesContext } from "./message";

export type ChatRoomsContext = {
  chatRooms: ChatRoomT[];
  searchChatRooms: ChatRoomT[];
  socket: Socket | null;
  alreadyInit: boolean;
  setChatRooms: (chatRooms: ChatRoomT[]) => void;
  setAlreadyInit: (already: boolean) => void;
  setSearchChatRooms: (chatRooms: ChatRoomT[]) => void;
  setMesAnn: (AnnMes: {
    messageContent: string;
    chatRoomDisplayID: string;
  }) => Promise<void>;
  buildChatRoom: ({ name }: { name: string }) => Promise<ChatRoomT | undefined>;
  deleteChatRoom: ({
    chatRoomDisplayID,
  }: {
    chatRoomDisplayID: string;
  }) => void;
  fetchChatRooms: () => Promise<void>;
  searchChatRoom: ({ keyword }: { keyword: string }) => void;
};

export const ChatRoomsContext = createContext<ChatRoomsContext>({
  socket: null,
  chatRooms: [],
  searchChatRooms: [],
  alreadyInit: false,
  setChatRooms: () => {},
  setAlreadyInit: () => {},
  setSearchChatRooms: () => {},
  buildChatRoom: async () => {
    return undefined;
  },
  deleteChatRoom: async () => {
    return undefined;
  },
  setMesAnn: async () => {},
  fetchChatRooms: async () => {},
  searchChatRoom: () => {},
});

type Props = {
  children: React.ReactNode;
};

type newRooms = {
  userDisplayId: string;
  userName: string;
};

export function ChatRoomsProvider({ children }: Props) {
  const [chatRooms, setChatRooms] = useState<ChatRoomT[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [searchChatRooms, setSearchChatRooms] = useState([] as ChatRoomT[]);
  const [alreadyInit, setAlreadyInit] = useState(false);
  const searchParams = useSearchParams();
  const userName = searchParams.toString().split("=")[1];
  const { chatRoom, setChatRoom, setAnnMes } = useContext(MessagesContext);
  const token = localStorage.getItem("jwt-token");

  useEffect(() => {
    const initSocket = () => {
      const socket = io(env.NEXT_PUBLIC_SOCKET_URL);
      socket.emit("join_room", userName);

      socket.on("receive_chatRoom", (newChatRoom: ChatRoomT) => {
        console.log("new chatRoom");
        setChatRooms((chatRooms) => [...chatRooms, newChatRoom]);
        socket.emit("join_room", newChatRoom.chatRoomDisplayId);
      });

      socket.on(
        "receive_message",
        (chatRoomId: string, newMessage: Message) => {
          console.log("new chatRoom");
          setChatRooms((chatRooms) => {
            console.log(chatRooms);
            console.log(newMessage);
            const updateChatRoomName = chatRooms.filter(
              (cr) => cr.chatRoomDisplayId === chatRoomId,
            )[0].chatRoomName;
            const updateChatRoom = {
              chatRoomName: updateChatRoomName,
              chatRoomDisplayId: chatRoomId,
              lastMesSender: newMessage.senderName,
              lastMesContent: newMessage.content,
            } as ChatRoomT;
            console.log(
              chatRooms.filter((cr) => cr.chatRoomDisplayId !== chatRoomId),
            );
            console.log(updateChatRoom);
            return [
              updateChatRoom,
              ...chatRooms.filter((cr) => cr.chatRoomDisplayId !== chatRoomId),
            ];
          });
        },
      );

      socket.on("remove_chatRoom", (chatRoomId) => {
        console.log("Ready2Remove");
        setChatRooms(
          chatRooms.filter(
            (chatRoom) => chatRoom.chatRoomDisplayId !== chatRoomId,
          ),
        );
        console.log(chatRoomId);
        console.log(chatRoom?.chatRoomDisplayId);
        if (chatRoom?.chatRoomDisplayId === chatRoomId) {
          setChatRoom(chatRooms[0]);
        }
        socket.emit("left_room", chatRoomId);
      });

      setSocket(socket);
      setAlreadyInit(true);
    };
    initSocket();
    {/* eslint-disable-next-line react-hooks/exhaustive-deps */}
  }, []);

  const fetchChatRooms = async () => {
    if (!socket) {
      alert("No socket! Please retry later.");
      return;
    }
    try {
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
        data.chatRooms.map((chatRoom: ChatRoomT) =>
          socket.emit("join_room", chatRoom.chatRoomDisplayId),
        );
        setChatRoom(data.chatRooms[0]);
        setAnnMes(data.chatRooms[0].annMesContent);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const buildChatRoom = async ({ name }: { name: string }) => {
    if (!socket) {
      alert("No socket! Please retry later.");
      return;
    }
    try {
      const res = await fetch("api/chatRooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      const newChatRoom = {
        chatRoomDisplayId: data.chatRoomDisplayId,
        chatRoomName: name,
        lastTime: data.lastTime,
        lastMesSender: undefined,
        lastMesContent: undefined,
        annMesContent: undefined,
      } as ChatRoomT;
      const newChatRoom4Object = {
        ...newChatRoom,
        chatRoomName: userName,
      };
      setChatRooms((chatRooms) => [...chatRooms, newChatRoom]);
      socket.emit("left_room", chatRoom?.chatRoomDisplayId);
      socket.emit("build_chatRoom", newChatRoom4Object, name);
      socket.emit("join_room", data.chatRoomDisplayId);
      socket.emit("tell_mesSocket_join_room", userName, data.chatRoomDisplayId);
      return newChatRoom;
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
      await fetch("/api/chatRooms", {
        method: "PUT",
        body: JSON.stringify(AnnMes),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      socket.emit(
        "set_AnnMes",
        AnnMes.chatRoomDisplayID,
        AnnMes.messageContent,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteChatRoom = async ({
    chatRoomDisplayID,
  }: {
    chatRoomDisplayID: string;
  }) => {
    if (!socket) {
      alert("No socket! Please retry later.");
      return;
    }
    try {
      await fetch("api/chatRooms", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chatRoomDisplayID }),
      });
      socket.emit("delete_chatRoom", chatRoomDisplayID);
      return chatRoomDisplayID;
    } catch (error) {
      console.log(error);
    }
  };

  const searchChatRoom = async ({ keyword }: { keyword: string }) => {
    try {
      const res = await fetch(`/api/chatRooms?keyword=${keyword}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const { chatRooms, searchChatRooms, userDisplayId } = data;
      const chatRoomsUserNames = new Set(
        chatRooms.map((rooms: ChatRoomT) => rooms.chatRoomName),
      );
      const filteredSearchChatRooms = searchChatRooms.filter(
        (room: newRooms) =>
          !chatRoomsUserNames.has(room.userName) &&
          room.userDisplayId !== userDisplayId,
      );
      const realSearchChatRoons = filteredSearchChatRooms.map(
        (rooms: newRooms) => ({
          displayId: null,
          chatRoomName: rooms.userName,
          senderName: undefined,
          content: undefined,
        }),
      );
      const result = [...chatRooms, ...realSearchChatRoons] as
        | ChatRoomT[]
        | undefined;
      if (result !== undefined) {
        setSearchChatRooms(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ChatRoomsContext.Provider
      value={{
        socket,
        chatRooms,
        searchChatRooms,
        alreadyInit,
        setChatRooms,
        setSearchChatRooms,
        buildChatRoom,
        fetchChatRooms,
        setMesAnn,
        setAlreadyInit,
        searchChatRoom,
        deleteChatRoom,
      }}
    >
      {children}
    </ChatRoomsContext.Provider>
  );
}
