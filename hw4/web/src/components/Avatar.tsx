import type { User } from "@/package/types/user";
import React from "react";

type Props = {
  displayId: User["displayId"];
  classname?: string;
};

function Avatar({ displayId, classname }: Props) {
  return (
    <div
      className={`rounded-full flex items-center justify-center ${classname}`}
    >
      <span className="font-semibold text-sm">
        {/* The first letter of text */}
        {displayId.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

export default Avatar;
