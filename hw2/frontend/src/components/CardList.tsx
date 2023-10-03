import { useContext } from "react";
import { Link } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import useCards from "@/hooks/useCards";
import { showDeleteContext } from "@/pages/Home";
import { deleteList } from "@/utils/client";

import type { CardProps } from "./Card";

export type CardListProps = {
  id: string;
  name: string;
  cards: CardProps[];
  picture: string;
  description: string;
};

export default function CardList({ id, name, cards, picture }: CardListProps) {
  const { fetchLists } = useCards();

  const { showDelete } = useContext(showDeleteContext);

  const songsNum = Object.keys(cards).length;

  const handleDelete = async () => {
    try {
      await deleteList(id);
      fetchLists();
    } catch (error) {
      alert("Error: Failed to delete list");
    }
  };

  return (
    <>
      <Paper className="w-50 p-3">
        <div className="-m-8 grid justify-end">
          <IconButton
            color="error"
            onClick={handleDelete}
            className={`${showDelete ? "" : "pointer-events-none opacity-0"}`}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <Link to={`/playlist/${id}`}>
          <div>
            <img src={picture} alt="coverImage" className="rounded pt-8" />
          </div>
          <div className="mt-3 flex flex-col">
            <Typography className="pl-2 text-start " variant="h5">
              {name}
            </Typography>
            <Typography
              className="pl-2 text-start"
              variant="h6"
              color="primary"
            >
              {`${songsNum} songs`}
            </Typography>
          </div>
        </Link>
      </Paper>
    </>
  );
}
