"use client";
import { MessagesContext } from "@/context/message";
import { useSearchParams } from "next/navigation";
import React, { useContext, useState } from "react";
import ManipulateMesDialog from "./ManipulateMesDialog";
// import Avatar from "./Avatar";

function ChatRoomMessages() {
  const { messages, annMes, chatRoomName } = useContext(MessagesContext);
  const searchParams = useSearchParams();
  const userName = searchParams.toString().split("=")[1];
  const [open, setOpen] = useState(false);
  const [haveRight, setHaveRight] = useState(false);
  const [messageC, setMessageC] = useState("");

  return (
    <>
      <nav className="w-full shadow-md p-3 text-md font-semibold">
        {chatRoomName}
      </nav>
      {annMes && (
        <div className="flex justify-between w-full border-b border-gray-300 border-bold p-2">
          <p className="font-bold">Announced Mes !</p>
          {annMes}
        </div>
      )}
      <div className="px-2 pt-4">
        {messages?.map((message, index) => {
          const isSender = message.senderName === userName;
          return (
            <div className="py-0.5" key={index}>
              <div>
                <div
                  className={`flex flex-row items-end gap-2 ${
                    isSender && "justify-end"
                  }`}
                >
                  {/* {!isSender && (
                    <Avatar
                      displayId={message.senderId}
                      classname="bg-black text-white w-8 h-8"
                    />
                  )} */}
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
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
              <ManipulateMesDialog
                isSender={haveRight}
                open={open}
                setOpen={setOpen}
                messageDisplayId={message.displayId!}
                messageContent={messageC}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ChatRoomMessages;
