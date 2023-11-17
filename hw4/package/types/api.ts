import { User } from "./user";
import { ChatRoomT } from "./chatRoom";

export type LoginRequest = {
  name: User["name"];
  password: string;
};
export type LoginResponse = {
  user: Omit<User, "hashedPassword">;
  token: string;
};

export type GetChatRoomsRequest = {
  userId: User["displayId"];
};
export type GetChatRoomsResponse = Omit<ChatRoomT, "announced">[];

export type CreateChatRoomRequest = ChatRoomT;
export type CreateChatRoomResponse = Omit<ChatRoomT, "announced">;
