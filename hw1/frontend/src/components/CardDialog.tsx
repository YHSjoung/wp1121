import { useEffect, useState } from "react";

import { Delete as DeleteIcon } from "@mui/icons-material";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import useCards from "@/hooks/useCards";
import { createCard, deleteCard, updateCard } from "@/utils/client";

type NewCardDialogProps = {
  variant: "new";
  open: boolean;
  onClose: () => void;
  // listId: string;
};

type EditCardDialogProps = {
  variant: "edit";
  open: boolean;
  onClose: () => void;
  cardId: string;
  title: string;
  description: string;
  moods: string;
  tags: string;
};

type CardDialogProps = NewCardDialogProps | EditCardDialogProps;

export const moodsset = ["happy", "angry", "sad"];
export const tagsset = ["club", "studies", "interpersonal"];

export default function CardDialog(props: CardDialogProps) {
  const { variant, open, onClose} = props;
  const title = variant === "edit" ? props.title : "";
  const description = variant === "edit" ? props.description : "";
  const moods = variant === "edit" ? props.moods : "";
  const tags = variant === "edit" ? props.tags : "";

  const [edittingTitle, setEdittingTitle] = useState(variant === "new");
  const [edittingDescription, setEdittingDescription] = useState(variant === "new");
  

  // using a state variable to store the value of the input, and update it on change is another way to get the value of a input
  // however, this method is not recommended for large forms, as it will cause a re-render on every change
  // you can read more about it here: https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newMoods, setNewMoods] = useState(moods);
  const [newTags, setNewTags] = useState(tags);


  useEffect(() => {
    if (open) {
      setNewDescription(description);
      setNewTitle(title);
      setNewMoods(moods);
      setNewTags(tags);
    }
  }, [open])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const initialDateString = e.target.value;
    // console.log(initialDateString);
    const datepart = initialDateString.replace("-",".").replace("-",".");
    const datework = datepart.split(".")
    const years = parseInt(datework[0]);
    const months = parseInt(datework[1]);
    const days = parseInt(datework[2]);
    const date = new Date(years, months-1, days);
    const weekday = date.toLocaleDateString("zh-TW", {weekday:'narrow'});
    const dateoutput = datepart + " (" + weekday + ")";
    setNewTitle(dateoutput);
  }

  // const [newListId, setNewListId] = useState(listId);

  // const { lists, fetchCards } = useCards();
  const { fetchCards } = useCards();

  const handleClose = () => {
    onClose();
    if (variant === "edit") {
      setNewTitle(title);
      setNewDescription(description);
      setNewMoods(moods);
      setNewTags(tags);
    }
  };

  const handleSave = async () => {
    try {
      if (variant === "new") {
        await createCard({
          title: newTitle,
          description: newDescription,
          moods: newMoods,
          tags: newTags,
        });
      } else {
        if (
          newTitle === title &&
          newDescription === description &&
          newMoods === moods &&
          newTags === tags 
        ) {
          return;
        }
        await updateCard(props.cardId, {
          title: newTitle,
          description: newDescription,
          moods: newMoods,
          tags: newTags
        });
      }
      fetchCards();
    } catch (error) {
      alert("Error: Failed to save card");
    } finally {
      handleClose();
    }
  };

  const handleDelete = async () => {
    if (variant !== "edit") {
      return;
    }
    try {
      await deleteCard(props.cardId);
      fetchCards();
    } catch (error) {
      alert("Error: Failed to delete card");
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
              type="date"
              autoFocus
              defaultValue={title}
              onChange={handleDateChange}
              className="grow"
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEdittingTitle(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newTitle}</Typography>
          </button>
        )}
        <Select
          value={newMoods}
          onChange={(e) => setNewMoods(e.target.value)}
          displayEmpty
          color="primary"
        >
          <MenuItem value="" disabled>Select your mood</MenuItem>
          {moodsset.map((mood) => (
            <MenuItem key={mood} value={mood}>
              {mood}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={newTags}
          onChange={(e) => setNewTags(e.target.value)}
          displayEmpty
          color="success"
          >
            <MenuItem value="" disabled>Select your tags</MenuItem>
            {tagsset.map((tag) => (
              <MenuItem key={tag} value={tag}>
                {tag}
              </MenuItem>
            ))}
          </Select>
        {variant === "edit" && (
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        )}
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
              rows={5}
              cols={65}
              className="bg-white/0 p-2"
              autoFocus
              defaultValue={description}
              placeholder="Add a more detailed description..."
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
        <DialogActions>
          <Button onClick={handleSave}>save</Button>
          <Button onClick={handleClose}>close</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
