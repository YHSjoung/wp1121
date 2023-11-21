"use client";
import { MessagesContext } from "@/context/message";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import ManipulateMesDialog from "./ManipulateMesDialog";
import Avatar from "./Avatar";

function ChatRoomMessages() {
  const { messages, chatRoom, annMes } = useContext(MessagesContext);
  const searchParams = useSearchParams();
  const userName = searchParams.toString().split("=")[1];
  const [open, setOpen] = useState(false);
  const [haveRight, setHaveRight] = useState(false);
  const [messageC, setMessageC] = useState("");
  const [messageId, setMessageId] = useState<string>();
  const urlPattern =
    /(\bhttps?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
  const endOfMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="flex flex-col fixed top-0 z-10 items-center gap-1 xl:w-1/2 w-3/4">
        <nav className="w-full shadow-md p-3 text-md font-semibold bg-white">
          {chatRoom?.chatRoomName}
        </nav>
        {annMes && (
          <div className="w-full p-2">
            <div className="flex justify-between border border-black-500 border-bold p-2 rounded-xl bg-white">
              <p className="font-bold">Announced Mes !</p>
              {annMes}
            </div>
          </div>
        )}
      </div>
      <div className="h-4 my-3" />
      {annMes && <div className="h-8 my-4" />}
      <div className="px-2 pt-4">
        {messages?.map((message, index) => {
          const isSender = message.senderName === userName;
          const processedContent = message.content.replace(
            urlPattern,
            (url) => {
              return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: blue;">${url}</a>`;
            },
          );
          console.log(processedContent);
          return (
            <div className="py-0.5" key={index}>
              <div>
                <div
                  className={`flex flex-row items-end gap-2 ${
                    isSender && "justify-end"
                  }`}
                >
                  {!isSender && (
                    <Avatar
                      displayId={message.senderName}
                      classname="bg-black text-white w-8 h-8"
                    />
                  )}
                  <div
                    className={`max-w-[60%] rounded-2xl px-3 py-1 leading-6
                      ${
                        isSender
                          ? "bg-black text-white"
                          : " bg-gray-200 text-black"
                      }`}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setOpen(true);
                      setMessageC(message.content);
                      setHaveRight(isSender);
                      setMessageId(message.displayId);
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: processedContent }}
                      className="whitespace-normal max-w-md break-all"
                    />
                  </div>
                </div>
              </div>
              <ManipulateMesDialog
                isSender={haveRight}
                open={open}
                setOpen={setOpen}
                messageDisplayId={messageId!}
                messageContent={messageC}
              />
            </div>
          );
        })}
        <div ref={endOfMessageRef} />
      </div>
    </>
  );
}

export default ChatRoomMessages;
