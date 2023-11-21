import { User } from "./user";
export type ChatRoomT = {
  chatRoomName: string;
  chatRoomDisplayId: string;
  lastMesSender?: User["name"];
  lastMesContent?: string;
  annMesContent?: string;
  lastTime?: string;
};
