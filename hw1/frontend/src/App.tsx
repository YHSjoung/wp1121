import { useState, useEffect, createContext} from "react";


import HeaderBar from "@/components/HeaderBar";
import useCards from "@/hooks/useCards";

import Card from "@/components/Card";

export const MoodTagContext = createContext({
  moodTag: "ALL",
  setMoodTag: (value: string) => {}
});

function App() {
  const { rawCards, fetchCards, moodsSets, tagsSets } = useCards();
  const [moodTag, setMoodTag] = useState("ALL");

  const routeLookUpTable: Record<string, any> = {
    "ALL":rawCards,
    "HAPPY":moodsSets.happy.cards,
    "SAD":moodsSets.sad.cards,
    "ANGRY":moodsSets.angry.cards,
    "CLUB":tagsSets.club.cards,
    "STUDIES":tagsSets.studies.cards,
    "INTERPERSONAL":tagsSets.interpersonal.cards,
  };
  const [route, setRoute] = useState(rawCards);
  
  useEffect(() => {
    setRoute(routeLookUpTable[moodTag]);
    console.log(moodTag);
  },[moodTag, fetchCards, routeLookUpTable])
  
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return (
    <>
    <MoodTagContext.Provider value={{moodTag, setMoodTag}}>
      <HeaderBar />
      <main className="flex flex-wrap justify-start gap-6 px-30 py-12 max-h-full">
        <div className="flex-wrap flex gap-10 px-24 h-1/5 ">
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
