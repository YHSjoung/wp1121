import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { GetCardsResponse, GetListsResponse } from "@lib/shared_types";

import type { CardListProps } from "@/components/CardList";
import { getCards, getLists } from "@/utils/client";

type CardContextType = {
  lists: CardListProps[];
  fetchLists: () => Promise<void>;
  fetchCards: () => Promise<void>;
};

// context is a way to share data between components without having to pass props down the component tree
const CardContext = createContext<CardContextType>({
  lists: [],
  fetchLists: async () => {},
  fetchCards: async () => {},
});

type CardProviderProps = {
  children: React.ReactNode;
};

// all data fetching and processing is done here, the rest of the app just consumes the data exposed by this provider
// when we run fetchLists or fetchCards, we update the state of the provider, which causes the rest of the app to re-render accordingly
export function CardProvider({ children }: CardProviderProps) {
  const [rawLists, setRawLists] = useState<GetListsResponse>([]);
  const [rawCards, setRawCards] = useState<GetCardsResponse>([]);

  const fetchLists = useCallback(async () => {
    try {
      const { data } = await getLists();
      setRawLists(data);
    } catch (error) {
      alert("Error: failed to fetch lists");
    }
  }, []);

  const fetchCards = useCallback(async () => {
    try {
      const { data } = await getCards();
      setRawCards(data);
    } catch (error) {
      alert("Error: failed to fetch cards");
    }
  }, []);

  const lists = useMemo(() => {
    // you can do functional-ish programming in JS too
    const listMap = rawLists.reduce(
      (acc, list) => {
        acc[list.id] = { ...list, cards: [] };
        return acc;
      },
      {} as Record<string, CardListProps>,
    );
    // or you can do for loops
    for (const card of rawCards) {
      listMap[card.list_id].cards.push({
        ...card,
        listId: card.list_id,
      });
    }
    return Object.values(listMap);
  }, [rawCards, rawLists]);

  return (
    <CardContext.Provider
      value={{
        lists,
        fetchLists,
        fetchCards,
      }}
    >
      {children}
    </CardContext.Provider>
  );
}

// this is a custom hook, the name must start with "use"
export default function useCards() {
  return useContext(CardContext);
}
