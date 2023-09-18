import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import {useState} from "react";

import { Add as AddIcon } from "@mui/icons-material";
import { Button} from "@mui/material";


import CardDialog from "@/components/CardDialog";

export default function HeaderBar() {
  const [openNewCardDialog, setOpenNewCardDialog] = useState(false);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My Diary
        </Typography>
        <Button
            variant="contained"
            onClick={() => setOpenNewCardDialog(true)}
          >
            <AddIcon className="mr-2" />
            Add a Diary
          </Button>
          <CardDialog
          variant="new"
          open={openNewCardDialog}
          onClose={() => setOpenNewCardDialog(false)}
        />
      </Toolbar>
    </AppBar>
    
  );
}
