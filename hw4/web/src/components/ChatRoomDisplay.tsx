"use client";

import { ChatRoomsContext } from "@/context/chatRoom";
import { MessagesContext } from "@/context/message";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import ChatRoom from "./ChatRoom";
import SearchChatRoom from "./SearchChatRoom";
import { Search, PlusSquare } from "lucide-react";
import type { ChatRoomT } from "@/package/types/chatRoom";
import AddChatRoomDialog from "./AddChatRoomDialog";

export default function ChatRoomsDisplay() {
  const { chatRooms, setChatRooms } = useContext(ChatRoomsContext);
  const { setChatRoom, setAnnMes, setChatRoomName } =
    useContext(MessagesContext);
  const searchParams = useSearchParams();
  const userName = searchParams.toString().split("=")[1];
  const router = useRouter();
  const [search, setSearch] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchChatRooms, setSearchChatRooms] = useState([] as ChatRoomT[]);
  useEffect(() => {
    setSearch(false);
  }, [chatRooms]);

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
        return data.chatRooms[0];
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function ReuseFetchChatRooms() {
      const res = await fetchChatRooms();
      console.log(res);
      setChatRoom(res.displayId);
      setAnnMes(res.annMesContent);
      setChatRoomName(res.name);
    }
    ReuseFetchChatRooms();
    router.refresh();
    {/* eslint-disable-next-line react-hooks/exhaustive-deps */}
  },[]);

  const handleToggle = () => {
    setSearch(!search);
    setSearchChatRooms([]);
  };

  return (
    <div className="flex flex-col h-screen p-2 gap-2 justify-begin items-center">
      <div className="flex justify-between w-full px-7 mt-2">
        <div className="text-xl">Chat Room</div>
        <button onClick={() => setOpen(true)}>
          <PlusSquare size={24} className="text-gray-500" />
        </button>
      </div>
      {!search ? (
        <button onClick={handleToggle}>
          <div className="my-2 rounded-md border w-full flex items-center gap-2">
            <div className="bg-gray outline-none text-gray-500 my-3 text-lg pl-4">
              Search Your Friends!
            </div>
            <Search size={24} className="text-gray-500 text-md mx-4" />
          </div>
        </button>
      ) : (
        <SearchChatRoom
          onToggle={handleToggle}
          setSearchChatRooms={setSearchChatRooms}
        />
      )}
      {!search
        ? chatRooms?.map((chatRoom) => {
            return (
              <div className="w-full gap-2 flex flex-col px-2" key={chatRoom.displayId}>
                <ChatRoom
                  key={chatRoom.displayId}
                  displayId={chatRoom.displayId}
                  name={chatRoom.name}
                  senderName={
                    userName == chatRoom.senderName
                      ? "you"
                      : chatRoom.senderName
                  }
                  content={chatRoom.content}
                  annMesContent={chatRoom.annMesContent}
                />
              </div>
            );
          })
        : searchChatRooms?.map((chatRoom) => {
            return (
              <div className="w-full gap-2 flex flex-col px-2" key={chatRoom.displayId}>
                <ChatRoom
                  key={chatRoom.displayId}
                  displayId={chatRoom.displayId}
                  name={chatRoom.name}
                  senderName={
                    userName == chatRoom.senderName
                      ? "you"
                      : chatRoom.senderName
                  }
                  content={chatRoom.content}
                  annMesContent={chatRoom.annMesContent}
                />
              </div>
            );
          })}
      <AddChatRoomDialog open={open} setOpen={setOpen} />
    </div>
  );
}
