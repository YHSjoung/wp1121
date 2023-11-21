"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useRef, useState, useContext } from "react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatRoomsContext } from "@/context/chatRoom";
import { MessagesContext } from "@/context/message";

export default function AddChatRoomDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const [isEmpty, setIsEnpty] = useState(false);
  const [isYou, setIsYou] = useState(false);
  const [alreadyHad, setAlreadyHad] = useState(false);
  const { buildChatRoom } = useContext(ChatRoomsContext);
  const { setChatRoom, setAnnMes } = useContext(MessagesContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userName = searchParams.toString().split("=")[1];

  const handleBuild = async () => {
    setIsEnpty(false);
    setIsYou(false);
    setAlreadyHad(false);
    if (!usernameInputRef.current?.value) {
      setIsEnpty(true);
      return;
    }
    if (usernameInputRef.current.value === userName) {
      setIsYou(true);
      return;
    }
    const res = await buildChatRoom({
      name: usernameInputRef.current.value,
    });
    setChatRoom(res!);
    setAnnMes(undefined);
    handleClose();
    router.refresh();
  };

  const handleClose = () => {
    setIsEnpty(false);
    setOpen(false);
    setIsYou(false);
    setAlreadyHad(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-3 mt-2">Add New Friend</DialogTitle>
          <DialogDescription>Enter the user you want to chat</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="user"
            className="text-right text-lg dark:text-neutral-400"
          >
            User
          </Label>
          <Input
            placeholder="Enter the user name"
            className={cn(
              "border-white-500",
              "col-span-3 dark:text-neutral-400",
            )}
            ref={usernameInputRef}
          />
          {isEmpty && (
            <p className="col-span-3 col-start-2 text-xs text-red-500">
              please enter the user name
            </p>
          )}
          {isYou && (
            <p className="col-span-3 col-start-2 text-xs text-red-500">
              You can't add yourself
            </p>
          )}
          {alreadyHad && (
            <p className="col-span-3 col-start-2 text-xs text-red-500">
              You already had the chat room with this user
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <button
            className="border dark:border-blue-500 dark:bg-blue-700 rounded-lg w-1/5 dark:text-neutral-400 py-1 "
            onClick={handleBuild}
          >
            Add
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
