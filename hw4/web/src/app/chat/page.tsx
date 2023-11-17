import ChatRoomInput from "@/components/ChatRoomInput";
import ChatRoomMessages from "@/components/ChatRoomMessages";

import React from "react";

function Message() {
  return (
    <>
      <div className="overflow-y-scroll grow">
        <ChatRoomMessages />
      </div>
      <div className="p-2">
        <ChatRoomInput />
      </div>
    </>
  );
}

export default Message;
