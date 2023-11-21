import { User } from "./user";
import { ChatRoomT } from "./chatRoom"

export type Message = {
  displayId: string;
  content: string;
  senderId?: User["displayId"];
  senderName: User["name"];
  chatRoomId: ChatRoomT["chatRoomDisplayId"];
};
