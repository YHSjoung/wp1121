import { useState, useReducer } from "react";

import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import useCards from "@/hooks/useCards";
import { createCard, updateCard } from "@/utils/client";

import type { CardProps } from "./Card";

// this pattern is called discriminated type unions
// you can read more about it here: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
// or see it in action: https://www.typescriptlang.org/play#example/discriminate-types
type NewCardDialogProps = {
  variant: "new";
  open: boolean;
  onClose: () => void;
  listId: string;
};

type EditCardDialogProps = {
  variant: "edit";
  open: boolean;
  onClose: () => void;
  listId: string;
  cardId: string;
  title: string;
  description: string;
  link: string;
};

type CardDialogProps = NewCardDialogProps | EditCardDialogProps;

type ActionType = { type: "SET_CARD"; payload: Omit<CardProps, "id"> };

const cardReducer = (state: Omit<CardProps, "id">, action: ActionType) => {
  switch (action.type) {
    case "SET_CARD":
      return action.payload;
    default:
      return state;
  }
};

export default function CardDialog(props: CardDialogProps) {
  const { variant, open, onClose, listId } = props;
  const title = variant === "edit" ? props.title : "";
  const description = variant === "edit" ? props.description : "";
  const link = variant === "edit" ? props.link : "";

  const [edittingTitle, setEdittingTitle] = useState(variant === "new");
  const [edittingDescription, setEdittingDescription] = useState(
    variant === "new",
  );
  const [edittingLink, setEdittingLink] = useState(variant === "new");

  // using a state variable to store the value of the input, and update it on change is another way to get the value of a input
  // however, this method is not recommended for large forms, as it will cause a re-render on every change
  // you can read more about it here: https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
  const initCard: Omit<CardProps, "id"> = {
    title: title,
    description: description,
    listId: listId,
    link: link,
  };

  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newListId, setNewListId] = useState(listId);
  const [newLink, setNewLink] = useState(link);

  const { lists, fetchCards } = useCards();

  const [_card, dispatch] = useReducer(cardReducer, initCard);

  const handleClose = () => {
    onClose();
    if (variant === "edit") {
      dispatch({
        type: "SET_CARD",
        payload: {
          title: newTitle,
          description: newDescription,
          listId: newListId,
          link: newLink,
        },
      });
    } else {
      setNewTitle("");
      setNewDescription("");
      setNewLink("");
    }
  };

  const handleSave = async () => {
    try {
      const list4UpdateSong = lists.find((list) => list.id === listId);
      const songNameList = list4UpdateSong?.cards.map((card) => card.title);
      const theSameSongNameNum = songNameList?.filter(
        (name) => name === newTitle,
      ).length as number;
      if (
        (theSameSongNameNum > 0 && variant === "new") ||
        (theSameSongNameNum > 1 && variant === "edit")
      ) {
        throw new Error("There is already have the same song");
      }
      if (newListId !== listId) {
        const list4UpdateSong = lists.find((list) => list.id === newListId);
        const songNameList = list4UpdateSong?.cards.map((card) => card.title);
        const theSameSongNameNum = songNameList?.filter(
          (name) => name === newTitle,
        ).length as number;
        if (theSameSongNameNum > 0) {
          throw new Error("There is already have the same song");
        }
      }
      if (!newTitle) {
        throw new Error("Please enter the song name");
      }

      if (!newDescription) {
        throw new Error("Please enter the singer");
      }

      if (!newLink) {
        throw new Error("Please enter the link");
      }
      if (variant === "new") {
        await createCard({
          title: newTitle,
          description: newDescription,
          list_id: listId,
          link: newLink,
        });
      } else {
        if (
          newTitle === title &&
          newDescription === description &&
          newListId === listId &&
          newLink === link
        ) {
          return;
        } else {
          if (newListId !== listId) {
            await createCard({
              title: newTitle,
              description: newDescription,
              list_id: newListId,
              link: newLink,
            });
            await updateCard(props.cardId, {
              title: newTitle,
              description: newDescription,
              list_id: listId,
              link: newLink,
            });
          } else {
            // typescript is smart enough to know that if variant is not "new", then it must be "edit"
            // therefore props.cardId is a valid value
            await updateCard(props.cardId, {
              title: newTitle,
              description: newDescription,
              list_id: newListId,
              link: newLink,
            });
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Error: Failed to save card");
      }
    } finally {
      handleClose();
      fetchCards();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className="flex gap-4">
        {edittingTitle ? (
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEdittingTitle(false);
              }
            }}
          >
            <Input
              autoFocus
              defaultValue={_card.title}
              onChange={(e) => setNewTitle(e.target.value)}
              className="grow"
              placeholder="Enter the song name..."
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEdittingTitle(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start" variant="h4">
              {newTitle}
            </Typography>
          </button>
        )}
        <Select
          value={newListId}
          onChange={(e) => setNewListId(e.target.value)}
        >
          {lists.map((list) => (
            <MenuItem value={list.id} key={list.id}>
              {list.name}
            </MenuItem>
          ))}
        </Select>
      </DialogTitle>
      <DialogContent className="w-[600px]">
        {edittingDescription ? (
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEdittingDescription(false);
              }
            }}
          >
            <textarea
              className="bg-white/0 p-2"
              autoFocus
              defaultValue={description}
              placeholder="The singer of this song..."
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEdittingDescription(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newDescription}</Typography>
          </button>
        )}
        {edittingLink ? (
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEdittingLink(false);
              }
            }}
          >
            <textarea
              className="bg-white/0 p-2"
              autoFocus
              defaultValue={link}
              placeholder="The URL of this song..."
              onChange={(e) => setNewLink(e.target.value)}
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEdittingLink(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newLink}</Typography>
          </button>
        )}
        <DialogActions>
          <Button onClick={handleSave}>save</Button>
          <Button onClick={handleClose}>close</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
