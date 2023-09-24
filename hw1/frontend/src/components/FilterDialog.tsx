import { useState, useContext } from "react";

import { Button, Dialog, MenuItem } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";

import { MoodTagContext } from "@/App";

// import useCards from "@/hooks/useCards";

export type ChooseMoodTagType = {
  open: boolean;
  onClose: () => void;
};

export default function FilterDialog(props: ChooseMoodTagType) {
  const { open, onClose } = props;
  const selectOptions = [
    "ALL",
    "HAPPY",
    "SAD",
    "ANGRY",
    "CLUB",
    "STUDIES",
    "INTERPERSONAL",
  ];

  const [newMoodTag, setNewMoodTag] = useState("");
  const { moodTag, setMoodTag } = useContext(MoodTagContext);

  const handleChoose = () => {
    setMoodTag(newMoodTag);
    onClose();
  };

  const handleClose = () => {
    setNewMoodTag(moodTag);
    onClose();
  };

  return (
    <MoodTagContext.Provider value={{ moodTag, setMoodTag }}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="flex gap-6">Choose the Mood or Tag</DialogTitle>
        <DialogActions>
          <Select
            value={newMoodTag}
            onChange={(e) => setNewMoodTag(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select your mood or tag
            </MenuItem>
            {selectOptions.map((options) => (
              <MenuItem key={options} value={options}>
                {options}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={handleChoose}>Save</Button>
        </DialogActions>
      </Dialog>
    </MoodTagContext.Provider>
  );
}
