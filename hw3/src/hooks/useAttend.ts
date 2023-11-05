import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useAttend() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const attendEvent = async ({
    eventId,
    userHandle,
  }: {
    eventId: number;
    userHandle: string;
  }) => {
    if (loading) return;
    setLoading(true);

    const res = await fetch("/api/attend", {
      method: "POST",
      body: JSON.stringify({
        eventId,
        userHandle,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  const beAbsent = async ({
    eventId,
    userHandle,
  }: {
    eventId: number;
    userHandle: string;
  }) => {
    if (loading) return;

    setLoading(true);
    const res = await fetch("/api/attend", {
      method: "DELETE",
      body: JSON.stringify({
        eventId,
        userHandle,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  return {
    attendEvent,
    beAbsent,
    loading,
  };
}
