import { useState } from "react";

import { useRouter } from "next/navigation";

import useAttend from "./useAttend";

export default function useEvent() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { attendEvent } = useAttend();

  const postEvent = async ({
    content,
    beginAt,
    endAt,
    handle,
  }: {
    content: string;
    beginAt: string;
    endAt: string;
    handle: string;
  }) => {
    setLoading(true);

    const res = await fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({
        content,
        beginAt,
        endAt,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    // router.refresh() is a Next.js function that refreshes the page without
    // reloading the page. This is useful for when we want to update the UI
    // from server components.
    const body = await res.json();
    const searchParams = body.id;
    const founder = handle.split("=")[1];
    router.push(`/event/${searchParams}?${handle}`);
    setLoading(false);
    router.refresh();
    await attendEvent({
      eventId: searchParams,
      userHandle: founder,
    });
    return searchParams;
  };

  return {
    postEvent,
    loading,
  };
}
