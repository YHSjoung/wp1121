import { useEffect} from "react";


import HeaderBar from "@/components/HeaderBar";
import useCards from "@/hooks/useCards";

import Card from "@/components/Card";

function App() {
  const { rawCards, fetchCards } = useCards();


  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return (
    <>
      <HeaderBar />
      <main className="flex max-h-full flex-row gap-6 px-24 py-12">
        <div className="flex flex-col gap-4">
          {rawCards.map((card) => (
            <Card key={card.id} {...card} />
          ))}
        </div>
      </main>
    </>
  );
}

export default App;
