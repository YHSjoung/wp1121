import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { GetCardsResponse } from "@lib/shared_types";

import { getCards } from "@/utils/client";
import type { CardProps } from "@/components/Card";
import { moodsset } from "@/components/CardDialog";
import {tagsset} from "@/components/CardDialog";

type CardContextType = {
  rawCards: CardProps[];
  moodsSets: Record<string, CardMoodTagsListProps>;
  tagsSets: Record<string, CardMoodTagsListProps>;
  fetchCards: () => Promise<void>;
};
type CardMoodTagsListProps = {
  cards: CardProps[];
};
const CardContext = createContext<CardContextType>({
  rawCards: [],
  moodsSets: {},
  tagsSets: {},
  fetchCards: async () => {},
});

type CardProviderProps = {
  children: React.ReactNode;
};

// all data fetching and processing is done here, the rest of the app just consumes the data exposed by this provider
// when we run fetchLists or fetchCards, we update the state of the provider, which causes the rest of the app to re-render accordingly
export function CardProvider({ children }: CardProviderProps) {
  const [rawCards, setRawCards] = useState<GetCardsResponse>([]);

  const fetchCards = useCallback(async () => {
    try {
      const { data } = await getCards();
      setRawCards(data);
    } catch (error) {
      alert("Error: failed to fetch cards");
    }
  }, []);

  const moodsSets = useMemo(() => {
    const moodsMap = moodsset.reduce(
      (acc, mood) => {
        acc[mood] = {cards:[]};
        return acc;
      },
      {} as Record<string, CardMoodTagsListProps>,
    );

    for (const card of rawCards) {
      if (card.moods) { // 檢查 card.moods 是否存在
        moodsMap[card.moods].cards.push({...card});
      }
    }
    // return Object.values(moodsMap);
    return moodsMap;
  },[rawCards]);

  const tagsSets = useMemo(() => {
    const tagsMap = tagsset.reduce(
      (acc, tag) => {
        acc[tag] = {cards:[]};
        return acc;
      },
      {} as Record<string, CardMoodTagsListProps>,
    );
    for (const card of rawCards) {
      if (card.tags) {
        tagsMap[card.tags].cards.push({...card});
      }
  
    }
    // return Object.values(tagsMap);
    return tagsMap;
  },[rawCards]);

  return (
    <CardContext.Provider
      value={{
        rawCards,
        moodsSets,
        tagsSets,
        fetchCards,
      }}
    >
      {children}
    </CardContext.Provider>
  );
}

export default function useCards() {
  return useContext(CardContext);
}
