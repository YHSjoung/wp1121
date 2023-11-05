"use client";

import { useState } from "react";
import type { EventHandler, MouseEvent } from "react";

import useAttend from "@/hooks/useAttend";
import { cn } from "@/lib/utils";

type AttendButtonProps = {
  initialAttendants: number;
  initialAttended?: boolean;
  eventId: number;
  handle?: string;
};

export default function LikeButton({
  initialAttendants,
  initialAttended,
  eventId,
  handle,
}: AttendButtonProps) {
  const [attended, setAttended] = useState(initialAttended);
  const [attendants, setAttendants] = useState(initialAttendants);
  const { beAbsent, attendEvent, loading } = useAttend();

  const handleClick: EventHandler<MouseEvent> = async (e) => {
    // since the parent node of the button is a Link, when we click on the
    // button, the Link will also be clicked, which will cause the page to
    // navigate to the tweet page, which is not what we want. So we stop the
    // event propagation and prevent the default behavior of the event.
    e.stopPropagation();
    e.preventDefault();
    if (!handle) return;
    if (attended) {
      await beAbsent({
        eventId,
        userHandle: handle,
      });
      setAttendants((prev) => prev - 1);
      setAttended(false);
    } else {
      await attendEvent({
        eventId,
        userHandle: handle,
      });
      setAttendants((prev) => prev + 1);
      setAttended(true);
    }
  };

  return (
    <div className="mr-6 flex items-center gap-4">
      {`${(attendants > 0 && attendants) || 0} 人參加`}
      <button
        className={cn(
          "flex w-16 items-center gap-1 hover:text-brand",
          attended && "text-brand",
        )}
        onClick={handleClick}
        disabled={loading}
      >
        <div
          className={cn(
            "flex items-center gap-1 whitespace-nowrap rounded-md border p-1.5",
            "transition-colors duration-300 hover:bg-brand/10",
            attended && "bg-brand/10",
          )}
        >
          {attended ? "我已參加" : "我想參加"}
        </div>
      </button>
    </div>
  );
}
