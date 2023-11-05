"use client";

import { useEffect, useRef, useState } from "react";

import { useSearchParams } from "next/navigation";

import GrowingTextarea from "@/components/GrowingTextarea";
// all components is src/components/ui are lifted from shadcn/ui
// this is a good set of components built on top of tailwindcss
// see how to use it here: https://ui.shadcn.com/
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useEvent from "@/hooks/useEvent";
import { cn } from "@/lib/utils";

type EventDialogProps = {
  dialogopen: boolean;
  setDialogopen: (open: boolean) => void;
};
export default function EventDialog({
  dialogopen,
  setDialogopen,
}: EventDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const [handleErrorC, setHandleErrorC] = useState(false);
  const [handleErrorBT, setHandleErrorBT] = useState(false);
  const [handleErrorET, setHandleErrorET] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const beginTimeYRef = useRef<HTMLInputElement>(null);
  const beginTimeMRef = useRef<HTMLInputElement>(null);
  const beginTimeDRef = useRef<HTMLInputElement>(null);
  const beginTimeHRef = useRef<HTMLInputElement>(null);
  const endTimeYRef = useRef<HTMLInputElement>(null);
  const endTimeMRef = useRef<HTMLInputElement>(null);
  const endTimeDRef = useRef<HTMLInputElement>(null);
  const endTimeHRef = useRef<HTMLInputElement>(null);
  const { postEvent, loading } = useEvent();

  useEffect(() => {
    setDialogOpen(dialogopen);
  }, [dialogopen]);

  const handleEvent = async () => {
    setHandleErrorBT(false);
    setHandleErrorC(false);
    setHandleErrorET(false);

    const content = textareaRef.current?.value;
    const beginAtd = new Date(
      `${beginTimeYRef.current?.value}-${beginTimeMRef.current?.value}-${beginTimeDRef.current?.value}T${beginTimeHRef.current?.value}:00:00`,
    );
    const endAtd = new Date(
      `${endTimeYRef.current?.value}-${endTimeMRef.current?.value}-${endTimeDRef.current?.value}T${endTimeHRef.current?.value}:00:00`,
    );
    const handle = searchParams.toString();

    if (!content) {
      setHandleErrorC(true);
      return;
    }

    if (isNaN(beginAtd.getTime())) {
      setHandleErrorBT(true);
      return;
    }
    if (isNaN(endAtd.getTime())) {
      setHandleErrorET(true);
      return;
    }

    const diff = endAtd.getTime() - beginAtd.getTime();
    if (!(diff >= 0 && diff <= 7 * 24 * 3600 * 1000)) {
      setHandleErrorET(true);
      return;
    }

    const beginAt = beginAtd.toISOString();
    const endAt = endAtd.toISOString();

    try {
      await postEvent({
        content,
        beginAt,
        endAt,
        handle,
      });
      setDialogOpen(false);
      // this triggers the onInput event on the growing textarea
      // thus triggering the resize
      // for more info, see: https://developer.mozilla.org/en-US/docs/Web/API/Event
      textareaRef.current.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );
    } catch (e) {
      console.error(e);
      alert("Error adding event");
    }
  };

  // The Dialog component calls onOpenChange when the dialog wants to open or
  // close itself. We can perform some checks here to prevent the dialog from
  // closing if the input is invalid.
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setDialogOpen(true);
    } else {
      // if handleSave returns false, it means that the input is invalid, so we
      // don't want to close the dialog
      setDialogOpen(false);
      textareaRef.current!.value = "";
      beginTimeYRef.current!.value = "";
      beginTimeMRef.current!.value = "";
      beginTimeDRef.current!.value = "";
      beginTimeHRef.current!.value = "";
      endTimeYRef.current!.value = "";
      endTimeMRef.current!.value = "";
      endTimeDRef.current!.value = "";
      endTimeHRef.current!.value = "";
      setDialogopen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add an event!</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <div className="flex flex-col">
            <div className="flex items-end gap-2">
              Event Title
              {handleErrorC && (
                <p className="col-span-3 col-start-2 self-center text-xs text-red-500">
                  Event name cannot be empty.
                </p>
              )}
            </div>
            <div className="mb-2 mt-6">
              <GrowingTextarea
                ref={textareaRef}
                className={cn("pl-1", handleErrorC && "border-red-500")}
                placeholder="What's happening?"
                attended={true}
              />
            </div>
          </div>
          <div className="mb-2 mt-6">
            <p className="self-enter col-span-3 col-start-2 mb-2 font-bold">
              From
            </p>
            {handleErrorBT && (
              <p className="col-span-3 col-start-2 mb-2 self-center text-xs text-red-500">
                Choose the time event start.
              </p>
            )}
            <div className="flex">
              <Input ref={beginTimeYRef} className="w-1/2" placeholder="YYYY" />
              <p className="mx-2 text-4xl text-gray-300">/</p>
              <Input ref={beginTimeMRef} className="w-1/4" placeholder="MM" />
              <p className="mx-2 text-4xl text-gray-300">/</p>
              <Input ref={beginTimeDRef} className="w-1/4" placeholder="DD" />
              <p className="ml-2" />
              <Input ref={beginTimeHRef} className="w-1/4" placeholder="HH" />
            </div>
          </div>
          <div className="mb-2 mt-6">
            <p className="self-enter col-span-3 col-start-2 mb-2 font-bold">
              To
            </p>
            {handleErrorET && (
              <p className="col-span-3 col-start-2 mb-2 self-center text-xs text-red-500">
                Choose the time event end.
              </p>
            )}
            <div className="flex">
              <Input ref={endTimeYRef} className="w-1/2" placeholder="YYYY" />
              <p className="mx-2 text-4xl text-gray-300">/</p>
              <Input ref={endTimeMRef} className="w-1/4" placeholder="MM" />
              <p className="mx-2 text-4xl text-gray-300">/</p>
              <Input ref={endTimeDRef} className="w-1/4" placeholder="DD" />
              <p className="ml-2" />
              <Input ref={endTimeHRef} className="w-1/4" placeholder="HH" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <button
            className={cn(
              "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
              "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
            )}
            onClick={handleEvent}
            disabled={loading}
          >
            Add
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
