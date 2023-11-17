import { MessagesProvider } from "@/context/message";
import { ChatRoomsProvider } from "@/context/chatRoom";
import Header from "@/components/Header";
import ChatRoomsDisplay from "@/components/ChatRoomDisplay";

import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col fixed top-0 h-screen w-full overflow-hidden items-center ">
      <div className="xl:w-2/3 w-full h-screen">
        <MessagesProvider>
          <ChatRoomsProvider>
            <div className="w-full h-full overflow-hidden flex shadow-lg">
              <div className="w-1/4 ">
                <Header />
              </div>
              <div className="w-1/3 border">
                <ChatRoomsDisplay />
              </div>
              <div className="flex flex-col w-2/5">{children}</div>
            </div>
          </ChatRoomsProvider>
        </MessagesProvider>
      </div>
    </div>
  );
};

export default layout;
