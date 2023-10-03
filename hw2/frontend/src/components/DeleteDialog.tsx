import { Dialog } from "@mui/material";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";

type DeleteDialogProps = {
  open: boolean;
  onClose: () => void;
  handleDelete: () => Promise<void>;
  isCheckedList: string[];
};

export default function DeleteDialog({
  open,
  onClose,
  handleDelete,
  isCheckedList,
}: DeleteDialogProps) {
  const len = isCheckedList.length;
  return len ? (
    <Dialog open={open} onClose={onClose}>
      <div className="flex flex-col">
        <Typography variant="h5" className="p-5">
          Are you sure to delete the songs?
        </Typography>
        <div className="-mt-5 flex justify-center gap-4 p-5">
          <Button variant="contained" onClick={() => handleDelete()}>
            SURE
          </Button>
          <Button variant="contained" onClick={() => onClose()}>
            CANCEL
          </Button>
        </div>
      </div>
    </Dialog>
  ) : (
    <Dialog open={open} onClose={onClose}>
      <div className="flex flex-col">
        <Typography variant="h6" className="p-5">
          Please check the songs you want to delete
        </Typography>
      </div>
      <div className="-mt-2 flex justify-center p-3">
        <Button variant="contained" onClick={() => onClose()}>
          SURE
        </Button>
      </div>
    </Dialog>
  );
}
