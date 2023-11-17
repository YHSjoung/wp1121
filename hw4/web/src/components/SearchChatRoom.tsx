"use client";

import { useRef, useEffect } from "react";

import { Search, ChevronLeft } from "lucide-react";

// import UserAvatar from "@/components/UserAvatar";
import useChatRoom from "@/useHook/useChatRoom";
import { cn } from "@/lib/utils";
import type { EventHandler, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import type { ChatRoomT } from "@/package/types/chatRoom";

export default function SearchChatRoom({
  onToggle,
  setSearchChatRooms,
}: {
  onToggle: () => void;
  setSearchChatRooms: (chatRooms: ChatRoomT[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchChatRoom } = useChatRoom();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!inputRef.current?.value) {
      return;
    }
    const token = localStorage.getItem("jwt-token")!;
    const res = await searchChatRoom({
      keyword: inputRef.current.value,
      token,
    });
    const { conbinedChatRooms } = res;
    setSearchChatRooms(conbinedChatRooms);
    router.refresh();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleBack: EventHandler<MouseEvent> = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    onToggle();
  };

  return (
    <form
      className="flex gap-4"
      onClick={() => inputRef.current?.focus()}
      onSubmit={handleSubmit}
    >
      {/* <UserAvatar className="h-12 w-12" /> */}
      <div className="flex w-full flex-col px-2">
        <div className="my-2 rounded-md border w-full flex">
          <button
            className="items-center rounded-full px-2 text-sm text-brand"
            onClick={handleBack}
          >
            <ChevronLeft size={26} className="text-gray-500" />
          </button>
          <input
            className="bg-gray outline-none placeholder:text-gray-500 my-3 text-lg"
            placeholder="Search Your Friends!"
            ref={inputRef}
            type="text"
          />
          <button
            type="button"
            className={cn(
              "my-2 rounded-full bg-brand pr-4 text-white transition-colors",
            )}
            onClick={handleSubmit}
            disabled={!(inputRef.current?.value === undefined)}
          >
            <Search size={30} className="text-gray-500" />
          </button>
        </div>
        <div className="flex justify-end"></div>
      </div>
    </form>
  );
}
