import {
  useEffect,
  useState,
  useRef,
  useReducer,
  useMemo,
  useCallback,
} from "react";
import { createContext } from "react";
import { Link, useParams } from "react-router-dom";

import Card from "../components/Card";
import CardDialog from "../components/CardDialog";
import type { CardListProps } from "../components/CardList";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import Input from "@mui/material/Input";

import DeleteDialog from "@/components/DeleteDialog";
import useCards from "@/hooks/useCards";
import { updateList } from "@/utils/client";
import { deleteCard, storePicture } from "@/utils/client";

import { PlayListReducer } from "./PlayListReducer";

export const CheckAllorNotContext = createContext({
  checked: false,
  setChecked: (_value: boolean) => {},
});

function Playlist() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const dafaultListData = useMemo(() => {
    return {
      id: "",
      name: "",
      cards: [],
      picture: "",
      description: "",
    };
  }, []);

  const { lists, fetchLists, fetchCards } = useCards();
  const [edittingName, setEdittingName] = useState(false);
  const [edittingDescription, setEdittingDescription] = useState(false);
  const [checked, setChecked] = useState(false);
  const [openNewCardDialog, setOpenNewCardDialog] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const pictureInputRef = useRef<HTMLInputElement>(null);

  const { id } = useParams<{ id: string }>();
  const confirmedId = id || "";
  const list = lists.find((list) => list.id === confirmedId) || dafaultListData;
  const initPlayList: CardListProps = {
    id: confirmedId,
    name: list.name,
    cards: list.cards,
    picture: list.picture,
    description: list.description,
  };

  const [playList, dispatch] = useReducer(PlayListReducer, initPlayList);
  const [isCheckedList, setIsCheckedList] = useState<string[]>([]);

  useEffect(() => {
    if (!openNewCardDialog) {
      const list =
        lists.find((list) => list.id === confirmedId) || dafaultListData;
      dispatch({ type: "SET_PLAYLIST", payload: list });
    }
  }, [lists, confirmedId, dafaultListData, openNewCardDialog]);

  useEffect(() => {
    fetchCards();
    fetchLists();
  }, [fetchCards, fetchLists]);

  const handleToggle = useCallback((cardId: string, isChecked: boolean) => {
    if (isChecked) {
      setIsCheckedList((prev) => [...prev, cardId]);
    } else {
      setIsCheckedList((prev) => prev.filter((id) => id !== cardId));
    }
  }, []);

  const handleDelete = async () => {
    try {
      await deleteCard(isCheckedList);
      fetchCards();
    } catch (error) {
      alert("Fail to delet cards");
    } finally {
      setIsCheckedList([]);
      setChecked(false);
      setOpenDeleteDialog(false);
    }
  };

  const handleUpdateList = async () => {
    try {
      if (!nameInputRef.current?.value && edittingName) {
        throw new Error("Please enter the list name");
      }
      if (!descriptionInputRef.current?.value && edittingDescription) {
        throw new Error("Please enter the list description");
      }
      if (
        !nameInputRef.current?.value &&
        !descriptionInputRef.current?.value &&
        pictureInputRef.current &&
        !pictureInputRef.current.files?.length
      ) {
        return;
      }
      if (
        !pictureInputRef.current?.files ||
        !pictureInputRef.current.files?.length
      ) {
        return;
      }

      const newDescription =
        descriptionInputRef.current?.value || playList.description;
      const newName = nameInputRef.current?.value || playList.name;
      if (
        newDescription === playList.description &&
        newName === playList.name &&
        !pictureInputRef.current.files?.length
      ) {
        return;
      }

      const formData = new FormData();
      const reader = new FileReader();
      const file = pictureInputRef.current?.files[0];
      let newPicture: string = "";

      reader.onload = () => {
        const result = reader.result as string;
        dispatch({ type: "UPDATE_PICTURE", payload: result });
      };
      reader.readAsDataURL(file);

      if (file) {
        formData.append("picture", file);
        const response = await storePicture(formData);
        newPicture = response.data.imageUrl;
      }
      try {
        await updateList(confirmedId, {
          description: newDescription,
          name: newName,
          picture: newPicture,
        });
        dispatch({ type: "UPDATE_LISTDESCRIPTION", payload: newDescription });
        dispatch({ type: "UPDATE_LISTNAME", payload: newName });
      } catch (error) {
        alert("Error: Failed to update list name");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Error: Failed to update list");
      }
    } finally {
      setEdittingDescription(false);
      setEdittingName(false);
    }
  };
  const route = playList.picture;
  return (
    <>
      <div className="flex flex-col px-20 py-5">
        <div className="mb-5 flex w-full">
          <div className="m-3 flex w-1/3 justify-between">
            <div>
              <input
                type="file"
                accept="image/*"
                ref={pictureInputRef}
                style={{ display: "none" }}
                onChange={handleUpdateList}
              />
              <img
                src={route}
                alt="coverImage"
                className="rounded"
                onClick={() => {
                  pictureInputRef.current?.click();
                }}
              />
            </div>
          </div>
          <div className="flex w-full flex-col justify-between">
            <div className="flex flex-col">
              {edittingName ? (
                <ClickAwayListener onClickAway={handleUpdateList}>
                  <Input
                    autoFocus
                    defaultValue={playList.name}
                    className="grow"
                    placeholder="Enter a new name for this list..."
                    sx={{ fontSize: "2rem" }}
                    inputRef={nameInputRef}
                  />
                </ClickAwayListener>
              ) : (
                <button
                  onClick={() => setEdittingName(true)}
                  className=" rounded-md pb-2 pl-1 pr-2 pt-2 hover:bg-white/10"
                >
                  <Typography className="text-start" variant="h4">
                    {playList.name}
                  </Typography>
                </button>
              )}
              {edittingDescription ? (
                <ClickAwayListener onClickAway={handleUpdateList}>
                  <Input
                    autoFocus
                    defaultValue={playList.description}
                    className="grow"
                    placeholder="Enter a new description for this list..."
                    sx={{ fontSize: "2rem" }}
                    inputRef={descriptionInputRef}
                  />
                </ClickAwayListener>
              ) : (
                <button
                  onClick={() => setEdittingDescription(true)}
                  className="w-full rounded-md p-2 hover:bg-white/10"
                >
                  <Typography className="text-start" variant="h6">
                    {playList.description}
                  </Typography>
                </button>
              )}
            </div>
            <div className="flex w-full items-end justify-end gap-5">
              <Button
                variant="contained"
                onClick={() => setOpenNewCardDialog(true)}
              >
                Add
              </Button>
              <Button
                variant="contained"
                onClick={() => setOpenDeleteDialog(true)}
              >
                Delete
              </Button>
              <Link to={"/"}>
                <Button variant="contained">Home</Button>
              </Link>
            </div>
          </div>
        </div>
        <main className="flex w-full flex-col gap-4">
          <div className="flex justify-between p-2">
            <Checkbox
              size="medium"
              className="w-1/8"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <div className="flex w-1/4 items-center justify-center p-2 text-lg">
              Song
            </div>
            <div className="flex w-1/4 items-center justify-center text-lg">
              Singer
            </div>
            <div className="flex w-1/4 items-center justify-center text-lg">
              Link
            </div>
            <Button className="invisible" />
          </div>
          <div className="-mt-4 mb-2">
            <Divider />
          </div>
          <CheckAllorNotContext.Provider value={{ checked, setChecked }}>
            {playList.cards.map((card) => (
              <Card
                key={card.id}
                {...card}
                onToggle={(idd, iss) => handleToggle(idd, iss)}
              />
            ))}
          </CheckAllorNotContext.Provider>
        </main>
      </div>
      <CardDialog
        variant="new"
        open={openNewCardDialog}
        onClose={() => setOpenNewCardDialog(false)}
        listId={playList.id}
      />
      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        handleDelete={() => handleDelete()}
        isCheckedList={isCheckedList}
      />
    </>
  );
}

export default Playlist;
