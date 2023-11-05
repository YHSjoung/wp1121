"use client";

import { useEffect, useRef, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

// all components is src/components/ui are lifted from shadcn/ui
// this is a good set of components built on top of tailwindcss
// see how to use it here: https://ui.shadcn.com/
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, validateHandle } from "@/lib/utils";

export default function NameDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handleInputRef = useRef<HTMLInputElement>(null);
  const [handleError, setHandleError] = useState(false);

  useEffect(() => {
    const handle = searchParams.get("handle");
    // if any of the username or handle is not valid, open the dialog
    setDialogOpen(!validateHandle(handle));
  }, [searchParams]);

  const handleSave = () => {
    const handle = handleInputRef.current?.value;

    const newHandleError = !validateHandle(handle);
    setHandleError(newHandleError);

    if (newHandleError) {
      return false;
    }

    // when navigating to the same page with different query params, we need to
    // preserve the pathname, so we need to manually construct the url
    // we can use the URLSearchParams api to construct the query string
    // We have to pass in the current query params so that we can preserve the
    // other query params. We can't set new query params directly because the
    // searchParams object returned by useSearchParams is read-only.
    const params = new URLSearchParams(searchParams);
    params.set("handle", handle!);
    router.push(`${pathname}?${params.toString()}`);
    setDialogOpen(false);

    return true;
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
      handleSave() && setDialogOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Join Me!</DialogTitle>
          <DialogDescription>
            Tell us your name to start joining event.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                placeholder="your name"
                defaultValue={searchParams.get("handle") ?? ""}
                className={cn(handleError && "border-red-500")}
                ref={handleInputRef}
              />
            </div>
            {handleError && (
              <p className="col-span-3 col-start-2 text-xs text-red-500">
                Invalid name, use only{" "}
                <span className="font-mono">[a-z0-9\._-]</span>, must be between
                1 and 25 characters long.
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>start</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
