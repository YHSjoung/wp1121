export type CardData = {
  id: string;
  title: string;
  description: string;
  moods: string;
  tags: string;
};

export type ListData = {
  id: string;
  name: string;
  cards: CardData[];
};

export type GetCardsResponse = CardData[];

export type GetCardResponse = CardData;

export type CreateCardPayload = Omit<CardData, "id">;

export type CreateCardResponse = Pick<CardData, "id">;

export type UpdateCardPayload = Partial<Omit<CardData, "id">>;

export type UpdateCardResponse = "OK";

export type DeleteCardResponse = "OK";

export type GetListsResponse = Omit<ListData, "cards">[];

export type CreateListPayload = Omit<ListData, "id" | "cards">;

export type CreateListResponse = Pick<ListData, "id">;

export type UpdateListPayload = Partial<Omit<ListData, "id" | "cards">>;

export type UpdateListResponse = "OK";

export type DeleteListResponse = "OK";
