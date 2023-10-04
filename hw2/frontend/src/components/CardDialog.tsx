import { useState } from "react";

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
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newListId, setNewListId] = useState(listId);
  const [newLink, setNewLink] = useState(link);

  const { lists, fetchCards } = useCards();

  const handleClose = () => {
    onClose();
    if (variant === "edit") {
      setNewTitle(title);
      setNewDescription(description);
      setNewListId(listId);
      setNewLink(link);
    } else {
      setNewTitle("");
      setNewDescription("");
      setNewLink("");
    }
  };

  const handleSave = async () => {
    try {
      const list4UpdateSong = lists.find((list) => list.id === newListId);
      const songNameList = list4UpdateSong?.cards.map((card) => card.title);
      if (songNameList?.includes(newTitle)) {
        throw new Error("There is already have the same song");
      }
      if (variant === "new") {
        if (!newTitle) {
          throw new Error("Please enter the song name");
        } else {
          if (!newDescription) {
            throw new Error("Please enter the singer");
          } else {
            if (!newLink) {
              throw new Error("Please enter the link");
            }
          }
        }
        await createCard({
          title: newTitle,
          description: newDescription,
          list_id: listId,
          link: newLink,
        });
      } else {
        if (!newTitle) {
          throw new Error("Please enter the song name");
        } else {
          if (!newDescription) {
            throw new Error("Please enter the singer");
          } else {
            if (!newLink) {
              throw new Error("Please enter the link");
            }
          }
        }
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
      fetchCards();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Error: Failed to save card");
      }
    } finally {
      handleClose();
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
              defaultValue={title}
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
