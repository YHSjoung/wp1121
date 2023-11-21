"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContext } from "react";
import { ChatRoomsContext } from "@/context/chatRoom";

export default function DeleteChatRoomDialog({
  openD,
  setOpenD,
  displayId,
}: {
  openD: boolean;
  setOpenD: (open: boolean) => void;
  displayId: string;
}) {
  const { deleteChatRoom } = useContext(ChatRoomsContext);

  const handleDelete = async () => {
    deleteChatRoom({ chatRoomDisplayID: displayId });
    handleClose();
  };

  const handleClose = () => {
    setOpenD(false);
  };

  return (
    <Dialog open={openD} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-3 mt-2">
            Are You Sure to DELETE This Chat Room?
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <button
            className="border dark:border-red-500 dark:bg-red-700 rounded-lg w-1/5 dark:text-neutral-400 py-1 "
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
