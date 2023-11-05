"use client";

import { useRef } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

export default function SearchBar() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = async () => {
    const keyward = textareaRef.current?.value;
    if (!keyward) return;

    const params = new URLSearchParams(searchParams);
    params.set("query", keyward!);
    router.push(`${pathname}?${params.toString()}`);
  };

  const back2Home = async () => {
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    // this allows us to focus (put the cursor in) the textarea when the user
    // clicks anywhere on the div
    <div onClick={() => textareaRef.current?.focus()}>
      <div className="flex items-center justify-between gap-4 pb-2 pr-2 pt-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <button
          className={cn(
            "rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
            "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
          )}
          onClick={back2Home}
        >
          All
        </button>
        <textarea
          ref={textareaRef}
          className="h-12 w-full resize-none overflow-auto rounded-md border bg-transparent p-2 text-xl outline-none placeholder:text-gray-500"
          placeholder={"Search some event!"}
        />
        <button
          className={cn(
            "rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
            "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
          )}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}
