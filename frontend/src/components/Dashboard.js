import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';

function Dashboard({ user, onLogout }) {
  const [open, setOpen] = React.useState(false);
  const handleLogout = async () => {
    const email = user.email;
    const password = user.password;
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert("An error has occured. Please try again.");
      } else {
        onLogout();
      }
    }
    catch {
      setOpen(true)
    }
  };

  return (
    <Box>
      <Collapse in={open}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          "An error has occured. Please try again."
        </Alert>
      </Collapse>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography variant="h5">You're logged in!</Typography>
        <Typography variant="subtitle">Email: {user.email}</Typography>
        <Button
          style={{ width: "85px", fontSize: "0.7em", marginTop: "20px" }}
          variant="contained"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}

export default Dashboard;
