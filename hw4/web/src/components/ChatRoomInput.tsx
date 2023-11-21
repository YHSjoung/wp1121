"use client";

import { MessagesContext } from "@/context/message";
import { useContext, useState } from "react";
import { useSearchParams } from "next/navigation";

function ChatRoomInput() {
  const { sendMessage, chatRoom } = useContext(MessagesContext);
  const [content, setContent] = useState<string>("");
  const searchParams = useSearchParams();
  const userName = searchParams.toString().split("=")[1];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("PP");
    console.log(chatRoom);
    console.log("PP");
    if (!content) return;
    if (!chatRoom?.chatRoomDisplayId) return;
    sendMessage({
      content,
      senderName: userName,
      chatRoomId: chatRoom?.chatRoomDisplayId,
    });
    setContent("");
  };
  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Aa"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="text-md flex-1 border border-gray-300 p-1 rounded-md outline-none focus:border-gray-600 transition duration-200 ease-in-out"
      />
      <button
        type="submit"
        className="bg-black text-white py-1 px-2 rounded-lg text-sm hover:bg-gray-700 transition duration-200 ease-in-out"
      >
        Send
      </button>
    </form>
  );
}

export default ChatRoomInput;
