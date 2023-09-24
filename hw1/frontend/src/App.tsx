import { useState, useEffect, createContext } from "react";

import Card from "@/components/Card";
import HeaderBar from "@/components/HeaderBar";
import useCards from "@/hooks/useCards";
import type { CardProps } from "@/components/Card";

export const MoodTagContext = createContext({
  moodTag: "ALL",
  setMoodTag: (value: string) => {},
});

function App() {
  const { rawCards, fetchCards, moodsSets, tagsSets } = useCards();
  const [moodTag, setMoodTag] = useState("ALL");


  const routeLookUpTable: Record<string, CardProps[]> = {
    ALL: rawCards,
    HAPPY: moodsSets.happy.cards,
    SAD: moodsSets.sad.cards,
    ANGRY: moodsSets.angry.cards,
    CLUB: tagsSets.club.cards,
    STUDIES: tagsSets.studies.cards,
    INTERPERSONAL: tagsSets.interpersonal.cards,
  };
  const [route, setRoute] = useState(rawCards);

  useEffect(() => {
    setRoute(routeLookUpTable[moodTag]);
    console.log(moodTag);
  }, [moodTag, fetchCards, routeLookUpTable]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return (
    <>
      <MoodTagContext.Provider value={{ moodTag, setMoodTag }}>
        <HeaderBar />
        <main className="px-30 flex max-h-full flex-wrap justify-start gap-6 py-12">
          <div className="flex h-1/5 flex-wrap gap-10 px-24 ">
            {route.map((card) => (
              <Card key={card.id} {...card} />
            ))}
          </div>
        </main>
      </MoodTagContext.Provider>
    </>
  );
}

export default App;
