import { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import CardDialog from "./CardDialog";
import Chip from "@mui/material/Chip";




export type CardViewProps = {
  open: boolean;
  onClose: () => void;
  id: string;
  title: string;
  description: string;
  moods: string;
  tags: string;
};



export default function CardView(props: CardViewProps) {
  const { id, title, description, moods, tags, open, onClose} = props;

  const [editting, setEditting] = useState(false);

  const handleEdit = () => {
    setEditting(true);
  }


  const handleClose = () => {
    onClose();
  };


  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className="flex gap-4">
          <Typography className="text-start">{title}</Typography>
          <Chip label={moods}className="badge bg-primary " color="primary" style={{margin:"0 5px 0 5px", fontSize: "20px"}}/>
          <Chip label={tags}className="badge bg-primary "color="success" style={{margin:"0 5px 0 5px", fontSize: '20px'}}/>
      </DialogTitle>
        <DialogContent className="w-[600px]">
          <Typography className="text-start">{description}</Typography>
        <DialogActions>
          <Button size="large" onClick={handleEdit}>edit</Button>
        </DialogActions>
        <CardDialog
          variant="edit"
          open={editting}
          onClose={() => setEditting(false)}
          title={title}
          description={description}
          cardId={id}
          moods={moods}
          tags={tags}
        />
      </DialogContent>
    </Dialog>
  );
}

