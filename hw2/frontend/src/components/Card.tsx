import { useState, useContext, useEffect } from "react";

import { CheckAllorNotContext } from "../pages/PlayList";
import { Paper, Checkbox, Button, Link } from "@mui/material";

import CardDialog from "./CardDialog";

// import ReactPlayer from "react-player";
export type CardProps = {
  id: string;
  title: string;
  description: string;
  listId: string;
  link: string;
};

export type CardPropsWithOnTollge = CardProps & {
  onToggle: (Id: string, checked: boolean) => void;
};

export default function Card({
  id,
  title,
  description,
  listId,
  link,
  onToggle,
}: CardPropsWithOnTollge) {
  const [open, setOpen] = useState(false);
  const [click, setClick] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const { checked } = useContext(CheckAllorNotContext);

  useEffect(() => {
    onToggle(id, click);
  }, [click, id, onToggle]);

  useEffect(() => {
    if (checked) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [checked]);

  return (
    <>
      <Paper className="flex w-full justify-between p-2" elevation={6}>
        <Checkbox
          size="medium"
          className="w-1/8"
          checked={click}
          onChange={(e) => setClick(e.target.checked)}
        />
        <div className="flex w-1/4 items-center justify-center overflow-hidden truncate border-l border-neutral-600	p-2">
          <span className="relative block truncate">{title}</span>
        </div>
        <div className="flex w-1/4 items-center justify-center overflow-hidden truncate p-2">
          <span className="relative block truncate">{description}</span>
        </div>
        <Link
          href={link}
          className="flex w-1/4 items-center justify-center overflow-hidden truncate p-2"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
        >
          <span className="relative block truncate">{link}</span>
        </Link>
        {/* <ReactPlayer url={link} playing={false} /> */}
        <Button onClick={handleClickOpen} variant="contained">
          Edit
        </Button>
      </Paper>
      <CardDialog
        variant="edit"
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        description={description}
        link={link}
        listId={listId}
        cardId={id}
      />
    </>
  );
}
