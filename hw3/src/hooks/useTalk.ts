import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useTalk() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postTalk = async ({
    handle,
    content,
    replyToEventId,
  }: {
    handle: string;
    content: string;
    replyToEventId: number;
  }) => {
    setLoading(true);

    const res = await fetch("/api/talks", {
      method: "POST",
      body: JSON.stringify({
        handle,
        content,
        replyToEventId,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    // router.refresh() is a Next.js function that refreshes the page without
    // reloading the page. This is useful for when we want to update the UI
    // from server components.
    router.refresh();
    setLoading(false);
  };

  return {
    postTalk,
    loading,
  };
}
