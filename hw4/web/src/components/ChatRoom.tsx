"use client";
// import { getAvatar } from "@/lib/utils";

import HaveNotHadRoomDialog from "./HaveNotHadRoomDialog";
import DeleteChatRoomDialog from "./DeleteChatRoomDialog";
import { useState, useContext } from "react";
import { MessagesContext } from "@/context/message";

type ChatRoomProps = {
  name: string;
  senderName: string | undefined;
  displayId: string | undefined;
  content: string | undefined;
  annMesContent: string | undefined;
};

export default function ChatRoom({
  name,
  senderName,
  displayId,
  content,
  annMesContent,
}: ChatRoomProps) {
  const [open, setOpen] = useState(false);
  const { setChatRoom, setAnnMes, setChatRoomName } =
    useContext(MessagesContext);
  const [openD, setOpenD] = useState(false);

  return (
    <>
      {!displayId ? (
        <div className="w-full">
          <button onClick={() => setOpen(true)}>
            <div className="break-word m-4 gap-2 whitespace-pre-wrap border px-2 rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* <img
                  src={getAvatar(authorHandle)}
                  alt="avatar"
                  className="h-12 w-12 justify-center rounded-full"
                /> */}
              <article className="flex w-4/5 grow flex-col whitespace-pre-wrap my-1 gap-2 w-full">
                <p className="font-bold text-xl">{name}</p>
                {/* `white-space: pre-wrap` tells html to render \n and \t chracters  */}
                <p className="mt-1 whitespace-pre-wrap break-words text-gray-500">
                  Haven't had a chat room with
                </p>
              </article>
            </div>
          </button>
          <HaveNotHadRoomDialog open={open} setOpen={setOpen} />
        </div>
      ) : (
        <>
          <button
            onClick={() => {
              setChatRoom(displayId);
              setAnnMes(annMesContent!);
              setChatRoomName(name);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setOpenD(true);
            }}
          >
            <div className="break-word m-4 gap-2 whitespace-pre-wrap border px-2 rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* <img
                  src={getAvatar(authorHandle)}
                  alt="avatar"
                  className="h-12 w-12 justify-center rounded-full"
                /> */}
              <article className="flex w-4/5 grow flex-col whitespace-pre-wrap my-1 gap-2 w-full">
                <p className="font-bold text-xl">{name}</p>
                {/* `white-space: pre-wrap` tells html to render \n and \t chracters  */}
                <article className="mt-1 whitespace-pre-wrap break-words text-gray-500">
                  {content && `${senderName} say: ${content}`}
                  {!content && "Start talking to your new friend!"}
                </article>
              </article>
            </div>
          </button>
          <DeleteChatRoomDialog
            openD={openD}
            setOpenD={setOpenD}
            displayId={displayId}
          />
        </>
      )}
    </>
  );
}
