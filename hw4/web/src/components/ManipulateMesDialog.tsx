"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatRoomsContext } from "@/context/chatRoom";
import { MessagesContext } from "@/context/message";

export default function ManipulateMesDialog({
  open,
  setOpen,
  messageDisplayId,
  messageContent,
  isSender,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  messageDisplayId: string;
  messageContent: string;
  isSender: boolean;
}) {
  const { setMesAnn } = useContext(ChatRoomsContext);
  const { deleteMessage, chatRoom } = useContext(MessagesContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log(isSender);

  const handleDelete = async () => {
    const res = await deleteMessage({
      messageDisplayId: messageDisplayId,
      chatRoomDisplayID: chatRoom!,
    });
    console.log(res);
    router.refresh();
    // router.push(`/chat?${searchParams.toString()}`);
    handleClose();
  };

  const handleSetAnn = async () => {
    const res = await setMesAnn({
      messageContent: messageContent,
      chatRoomDisplayID: chatRoom!,
    });
    console.log(res);
    handleClose();
    router.push(`/chat?${searchParams.toString()}`);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="">
        <div className="flex flex-col gap-4">
          {isSender && (
            <>
              <button
                className="flex justify-between px-4 border dark:border-white-500 rounded-lg w-1/5 dark:text-neutral-400 py-1 w-full items-center"
                onClick={handleDelete}
              >
                <p className="font-bole text-xl">Delete Message</p>
                <p className="text-gray-400 text-sm">
                  Remove this message for everyone
                </p>
              </button>
              <button
                className="flex justify-between px-4 border dark:border-white-500 rounded-lg w-1/5 dark:text-neutral-400 py-1 w-full items-center"
                onClick={handleDelete}
              >
                <p className="font-bole text-xl">Remove Message</p>
                <p className="text-gray-400 text-sm">
                  Remove this message only for you
                </p>
              </button>
            </>
          )}
          <button
            className="flex justify-between px-4 border dark:border-white-500 rounded-lg w-1/5 dark:text-neutral-400 py-1 w-full items-center"
            onClick={handleSetAnn}
          >
            <p className="font-bole text-xl">Announcing Message</p>
            <p className="text-gray-400 text-sm">Set this message on the top</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
