import { useEffect, useState } from "react";
import { createContext } from "react";

import NewListDialog from "../components/NewListDialog";
import { Add as AddIcon } from "@mui/icons-material";
import { Done } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";

import CardList from "@/components/CardList";
import useCards from "@/hooks/useCards";

export const showDeleteContext = createContext({
  showDelete: false,
  setShowDelete: (_value: boolean) => {},
});

function Home() {
  const { lists, fetchLists, fetchCards } = useCards();
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [listNameList, setListNameList] = useState<string[]>([]);

  useEffect(() => {
    const listName2Update = lists.map((list) => list.name);
    setListNameList(listName2Update);
  }, [lists]);

  useEffect(() => {
    fetchLists();
    fetchCards();
  }, [fetchCards, fetchLists]);

  return (
    <>
      <showDeleteContext.Provider value={{ showDelete, setShowDelete }}>
        <div className="flex justify-between px-20 py-5">
          <Typography variant="h4">
            {/* px-10 v.s. px15 */}
            My Playlists
          </Typography>
          <div className="flex gap-6">
            <Button
              variant="contained"
              className="w-50"
              onClick={() => setNewListDialogOpen(true)}
            >
              <AddIcon className="mr-3" />
              ADD
            </Button>
            {!showDelete ? (
              <Button
                variant="contained"
                color="error"
                className="w-50"
                onClick={() => setShowDelete(true)}
              >
                <DeleteIcon className="mr-3" />
                DELET
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                className="w-50"
                onClick={() => setShowDelete(false)}
              >
                <Done className="mr-3" />
                DONE
              </Button>
            )}
            <NewListDialog
              open={newListDialogOpen}
              onClose={() => setNewListDialogOpen(false)}
              listNameList={listNameList}
            />
          </div>
        </div>
        <main className="mx-auto grid max-h-full gap-3 px-10  py-5 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
          {lists.map((list) => (
            <CardList key={list.id} {...list} />
          ))}
        </main>
      </showDeleteContext.Provider>
    </>
  );
}

export default Home;
