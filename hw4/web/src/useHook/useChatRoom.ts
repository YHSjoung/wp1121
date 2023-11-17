import type { ChatRoomT } from "@/package/types/chatRoom";

type newRooms = {
  userDisplayId: string;
  userName: string;
};

export default function useChatRoom() {
  const buildChatRoom = async ({
    name,
    token,
  }: {
    name: string;
    token: string;
  }) => {
    const res = await fetch("api/chatRooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error);
    }
    const { displayId } = data;
    return displayId;
  };

  const deleteChatRoom = async ({
    chatRoomDisplayID,
    token,
  }: {
    chatRoomDisplayID: string;
    token: string;
  }) => {
    const res = await fetch("api/chatRooms", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chatRoomDisplayID }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error);
    }
    return chatRoomDisplayID;
  };

  const searchChatRoom = async ({
    keyword,
    token,
  }: {
    keyword: string;
    token: string;
  }) => {
    const res = await fetch(`/api/chatRooms?keyword=${keyword}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error);
    }
    const { chatRooms, searchChatRooms, userDisplayId } = data;
    const chatRoomsUserNames = new Set(
      chatRooms.map((rooms: ChatRoomT) => rooms.name),
    );
    const filteredSearchChatRooms = searchChatRooms.filter(
      (room: newRooms) =>
        !chatRoomsUserNames.has(room.userName) &&
        room.userDisplayId !== userDisplayId,
    );
    const realSearchChatRoons = filteredSearchChatRooms.map(
      (rooms: newRooms) => ({
        displayId: null,
        name: rooms.userName,
        senderName: undefined,
        content: undefined,
      }),
    );
    const conbinedChatRooms = [...chatRooms, ...realSearchChatRoons];
    return { conbinedChatRooms };
  };

  return {
    buildChatRoom,
    searchChatRoom,
    deleteChatRoom,
  };
}
