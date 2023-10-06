import { useEffect, useState } from "react";
import { createContext } from "react";

import NewListDialog from "../components/NewListDialog";
import { Add as AddIcon } from "@mui/icons-material";
import { Done } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import { InputBase } from "@mui/material";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

import type { CardListProps } from "@/components/CardList";
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
  const [searchPromps, setSearchPromps] = useState<string>("");

  const [listNameList, setListNameList] = useState<string[]>([]);
  const [showLists, setShowLists] = useState<CardListProps[]>(lists);

  const handleSearch = () => {
    try {
      if (!searchPromps) {
        throw new Error("Please enter the song you want to search");
      }
      const findAns = lists.filter((list) =>
        list.cards.some((card) => card.title.includes(searchPromps)),
      );
      if (findAns.length === 0) {
        throw new Error("You don't have this song");
      }
      setShowLists(findAns);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Fail to find song");
      }
    } finally {
      setSearchPromps("");
    }
  };

  useEffect(() => {
    const listName2Update = lists.map((list) => list.name);
    setListNameList(listName2Update);
    setShowLists(lists);
  }, [lists]);

  useEffect(() => {
    fetchLists();
    fetchCards();
  }, [fetchCards, fetchLists]);

  return (
    <>
      <showDeleteContext.Provider value={{ showDelete, setShowDelete }}>
        <div className="flex justify-between px-20 py-5">
          <button onClick={() => setShowLists(lists)}>
            <Typography variant="h4">
              {/* px-10 v.s. px15 */}
              My Playlists
            </Typography>
          </button>
          <div className="flex gap-6">
            <Paper className="flex w-3/4 justify-between">
              <InputBase
                placeholder="Search with the song name"
                className="ml-2 mr-2 w-3/4"
                value={searchPromps}
                onChange={(e) => {
                  setSearchPromps(e.target.value);
                }}
              />
              <IconButton onClick={handleSearch}>
                <SearchIcon className="w-50 m-1" fontSize="medium" />
              </IconButton>
            </Paper>
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
                <DeleteIcon className="mr-4" />
                DELETE
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
          {showLists.map((list) => (
            <CardList key={list.id} {...list} />
          ))}
        </main>
      </showDeleteContext.Provider>
    </>
  );
}

export default Home;
