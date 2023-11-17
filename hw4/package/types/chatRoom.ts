import { Message } from "./message";
import { User } from "./user";
export type ChatRoomT = {
  name: string;
  displayId: string;
  senderName?: User["name"];
  content?: string;
  annMesContent?: string;
};
