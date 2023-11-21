"use client";

import { ChatRoomsContext } from "@/context/chatRoom";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import ChatRoom from "./ChatRoom";
import SearchChatRoom from "./SearchChatRoom";
import { Search, PlusSquare, LogOut } from "lucide-react";
import AddChatRoomDialog from "./AddChatRoomDialog";

export default function ChatRoomsDisplay() {
  const {
    chatRooms,
    searchChatRooms,
    setSearchChatRooms,
    fetchChatRooms,
    alreadyInit,
  } = useContext(ChatRoomsContext);
  console.log(chatRooms);
  const searchParams = useSearchParams();
  const userName = searchParams.toString().split("=")[1];
  const router = useRouter();
  const [search, setSearch] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSearch(false);
  }, [chatRooms]);

  useEffect(() => {
    if (alreadyInit) {
      fetchChatRooms();
      router.refresh();
    }
    {/* eslint-disable-next-line react-hooks/exhaustive-deps */}
  }, [alreadyInit]);

  const handleToggle = () => {
    setSearch(!search);
    setSearchChatRooms([]);
  };

  return (
    <div className="flex flex-col h-screen p-2 gap-2 justify-begin items-center overflow-y-scroll">
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
        <SearchChatRoom onToggle={handleToggle} />
      )}
      {!search
        ? chatRooms?.map((chatRoom) => {
            return (
              <div
                className="w-full gap-2 flex flex-col px-2"
                key={chatRoom.chatRoomDisplayId}
              >
                <ChatRoom
                  displayId={chatRoom.chatRoomDisplayId}
                  name={chatRoom.chatRoomName}
                  senderName={
                    userName == chatRoom.lastMesSender
                      ? "you"
                      : chatRoom.lastMesSender
                  }
                  content={chatRoom.lastMesContent}
                  annMesContent={chatRoom.annMesContent}
                />
              </div>
            );
          })
        : searchChatRooms?.map((chatRoom) => {
            return (
              <div
                className="w-full gap-2 flex flex-col px-2"
                key={chatRoom.chatRoomDisplayId}
              >
                <ChatRoom
                  displayId={chatRoom.chatRoomDisplayId}
                  name={chatRoom.chatRoomName}
                  senderName={
                    userName == chatRoom.lastMesSender
                      ? "you"
                      : chatRoom.lastMesSender
                  }
                  content={chatRoom.lastMesContent}
                  annMesContent={chatRoom.annMesContent}
                  onToggle={handleToggle}
                  search={search}
                />
              </div>
            );
          })}
      <AddChatRoomDialog open={open} setOpen={setOpen} />
      <div className="w-full pl-4">
        <Link
          href="/"
          className="p-2 rounded-full hover:bg-gray-200 flex gap-4 text-md font-bold fixed bottom-10 z-10 shadow border border-gray-100 bg-white"
        >
          <LogOut />
          Logout
        </Link>
      </div>
    </div>
  );
}
