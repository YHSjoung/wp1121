import Link from "next/link";

import { Check } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type EventProps = {
  handle?: string;
  id: number;
  content: string;
  attendants: number;
  beginAt: Date;
  endAt: Date;
  attended?: boolean;
};

// note that the Tweet component is also a server component
// all client side things are abstracted away in other components
export default function Event({
  handle,
  id,
  content,
  attendants,
  attended,
}: EventProps) {
  return (
    <>
      <Link
        className="w-full px-4 pt-3 transition-colors hover:bg-gray-50"
        href={{
          pathname: `/event/${id}`,
          query: {
            handle,
          },
        }}
      >
        <div className="flex justify-between">
          <article className="mt-2 whitespace-pre-wrap">{content}</article>
          <div className="my-2 flex items-center justify-between gap-4 text-gray-600">
            <Check size={20} className={cn({ invisible: !attended })} />
            {`${attendants || 0} 人參加`}
          </div>
        </div>
      </Link>
      <Separator />
    </>
  );
}
