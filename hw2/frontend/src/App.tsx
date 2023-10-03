import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HeaderBar from "@/components/HeaderBar";
import useCards from "@/hooks/useCards";
import Home from "@/pages/Home";

import Playlist from "./pages/PlayList";

function App() {
  const { fetchLists, fetchCards } = useCards();

  useEffect(() => {
    fetchLists();
    fetchCards();
  }, [fetchCards, fetchLists]);

  return (
    <>
      <Router>
        <HeaderBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playlist/:id" element={<Playlist />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
