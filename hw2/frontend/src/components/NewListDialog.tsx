import { useRef } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import useCards from "@/hooks/useCards";
import { createList } from "@/utils/client";

type NewListDialogProps = {
  open: boolean;
  onClose: () => void;
  listNameList: string[];
};

export default function NewListDialog({
  open,
  onClose,
  listNameList,
}: NewListDialogProps) {
  // using a ref to get the dom element is one way to get the value of a input
  // another way is to use a state variable and update it on change, which can be found in CardDialog.tsx
  const titleFieldRef = useRef<HTMLInputElement>(null);
  const descriptionFieldRef = useRef<HTMLInputElement>(null);

  const { fetchLists } = useCards();

  const handleAddList = async () => {
    try {
      const updateName = titleFieldRef.current?.value ?? "";
      const updateDescription = descriptionFieldRef.current?.value ?? "";
      if (!updateName) {
        throw new Error("Please enter the list name");
      } else {
        if (!updateDescription) {
          throw new Error("Please enter the list description");
        } else {
          if (listNameList.includes(updateName)) {
            throw new Error("There is already has the same list");
          }
          await createList({
            name: titleFieldRef.current?.value ?? "",
            picture: "http://localhost:8000/storePic/pd.png",
            description: descriptionFieldRef.current?.value ?? "",
          });
          fetchLists();
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Error: Failed to create list");
      }
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a list</DialogTitle>
      <DialogContent className="flex flex-col gap-3">
        <TextField
          inputRef={titleFieldRef}
          label="List Name"
          variant="outlined"
          sx={{ mt: 2 }}
          autoFocus
        />
        <TextField
          inputRef={descriptionFieldRef}
          label="List Description"
          variant="outlined"
          sx={{
            mt: 2,
            width: "300px",
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddList}>add</Button>
        <Button onClick={onClose}>cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
