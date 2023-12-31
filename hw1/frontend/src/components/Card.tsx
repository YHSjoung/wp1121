import { useState } from "react";

import { Paper } from "@mui/material";
// import { Tag } from "@mui/icons-material";
import Chip from "@mui/material/Chip";

import CardView from "./CardView";

export type CardProps = {
  id: string;
  title: string;
  description: string;
  moods: string;
  tags: string;
};

// export

export default function Card({
  id,
  title,
  description,
  moods,
  tags,
}: CardProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <button onClick={handleClickOpen} className="text-start">
        <Paper
          className="my-auto flex w-full flex-col justify-around p-6"
          elevation={6}
        >
          <Paper className="justify-around justify-around p-3">{title}</Paper>
          <div
            style={{ display: "flex", gap: "10px", margin: "10px 0 10px 0" }}
          >
            <Chip label={moods} color="primary" style={{ fontSize: "15px" }} />
            <Chip label={tags} color="success" style={{ fontSize: "15px" }} />
          </div>
        </Paper>
      </button>
      <CardView
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        description={description}
        moods={moods}
        tags={tags}
        id={id}
      />
    </>
  );
}
