"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useContext } from "react";
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
  const { deleteMessage, chatRoom, messages, setMessages, removeMessage } =
    useContext(MessagesContext);

  const handleDelete = async () => {
    try {
      if (!chatRoom?.chatRoomDisplayId) {
        return;
      }
      await deleteMessage({
        messageDisplayId: messageDisplayId,
        chatRoomDisplayID: chatRoom?.chatRoomDisplayId,
      });
      setMessages(
        messages.filter((message) => message.displayId !== messageDisplayId),
      );
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async () => {
    console.log(messageDisplayId);
    try {
      await removeMessage(messageDisplayId);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetAnn = async () => {
    try {
      if (!chatRoom?.chatRoomDisplayId) {
        return;
      }
      await setMesAnn({
        messageContent: messageContent,
        chatRoomDisplayID: chatRoom?.chatRoomDisplayId,
      });
      handleClose();
    } catch (error) {
      console.log(error);
    }
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
                onClick={handleRemove}
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
