import { Separator } from "@/components/ui/separator";
import { getAvatar } from "@/lib/utils";

type TalkProps = {
  authorHandle: string;
  content: string;
  createdAt: Date;
};

// note that the Tweet component is also a server component
// all client side things are abstracted away in other components
export default function Talk({ authorHandle, content }: TalkProps) {
  return (
    <>
      <div className="break-word m-4 flex gap-4 whitespace-pre-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getAvatar(authorHandle)}
          alt="avatar"
          className="h-12 w-12 justify-center rounded-full"
        />
        <article className="flex w-4/5 grow flex-col whitespace-pre-wrap">
          <p className="font-bold">{authorHandle}</p>
          {/* `white-space: pre-wrap` tells html to render \n and \t chracters  */}
          <article className="mt-2 whitespace-pre-wrap break-words">
            {content}
          </article>
        </article>
      </div>
      <Separator />
    </>
  );
}
