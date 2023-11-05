"use client";

import { useRef, useState } from "react";

import { useRouter } from "next/navigation";

import EventDialog from "@/components/EventDialog";
import UserAvatar from "@/components/UserAvatar";
import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";

export default function AddEvent() {
  const { handle } = useUserInfo();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [addEvent, setAddEvent] = useState(false);
  const router = useRouter();

  return (
    <div className="flex gap-4" onClick={() => textareaRef.current?.focus()}>
      <UserAvatar className="h-12 w-12" />
      <div className="flex w-full flex-col gap-2 px-2">
        <div className="flex justify-between">
          <p className="item-center p-2 text-lg font-bold">{`${handle}`}</p>
          <div className="flex gap-2">
            <button
              className="my-2 flex w-fit items-center rounded-full border-[1px] border-gray-300 px-4 py-2 text-sm font-bold text-brand"
              onClick={() => router.push("/")}
            >
              Logout
            </button>
            <button
              className={cn(
                "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
                "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
              )}
              onClick={() => setAddEvent(true)}
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <EventDialog dialogopen={addEvent} setDialogopen={setAddEvent} />
    </div>
  );
}
