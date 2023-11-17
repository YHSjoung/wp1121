"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function HaveNotHadRoomDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-3 mt-2">
            Haven't had a chat room with this user !
          </DialogTitle>
          <DialogDescription>
            Click the button [+] to add a chat room with this user !
          </DialogDescription>
          {/* <Dialog.Close asChild>
            <div className="flex border justify-center rounded-full bg-blue-300 px-3 py-1 w-1/5">
              OK
            </div>
          </Dialog.Close> */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
