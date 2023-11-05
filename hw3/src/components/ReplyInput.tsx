"use client";

import { useRef } from "react";

import GrowingTextarea from "@/components/GrowingTextarea";
import UserAvatar from "@/components/UserAvatar";
import useTalk from "@/hooks/useTalk";
import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";

type ReplyInputProps = {
  replyToEventId: number;
  attended: boolean;
};

export default function ReplyInput({
  replyToEventId,
  attended,
}: ReplyInputProps) {
  const { handle } = useUserInfo();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { postTalk, loading } = useTalk();

  const handleReply = async () => {
    const content = textareaRef.current?.value;
    if (!content) return;
    if (!handle) return;

    try {
      await postTalk({
        handle,
        content,
        replyToEventId,
      });
      textareaRef.current.value = "";
      // this triggers the onInput event on the growing textarea
      // thus triggering the resize
      // for more info, see: https://developer.mozilla.org/en-US/docs/Web/API/Event
      textareaRef.current.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );
    } catch (e) {
      console.error(e);
      alert("Error posting reply");
    }
  };

  return (
    // this allows us to focus (put the cursor in) the textarea when the user
    // clicks anywhere on the div
    <div onClick={() => textareaRef.current?.focus()}>
      <div className="break-word flex items-center justify-between gap-4 px-4 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <UserAvatar className="col-start-1 row-start-2 h-12 w-12" />
        <GrowingTextarea
          ref={textareaRef}
          wrapperClassName="col-start-2 row-start-2"
          className="bg-transparent text-xl outline-none placeholder:text-gray-500"
          placeholder={attended ? "Let's Talk!" : "Join and say something"}
          attended={attended}
        />
        <button
          className={cn(
            "rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
            "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
          )}
          onClick={handleReply}
          disabled={loading || !attended}
        >
          Reply
        </button>
      </div>
    </div>
  );
}
