import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import validateEmail from '../helpers/validateEmail';
import validatePassword from '../helpers/validatePassword';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = React.useState(false);
  const [emailError, setEmailError] = useState("");
  const [pwError, setPwError] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError(!validateEmail(event.target.value));
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPwError(!validatePassword(event.target.value));
  };

  const handleSubmit = async () => {
    if (!emailError && !pwError) {
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError("User Not Found. Please signup first!");
          setOpen(true)
        }
        else if (response.status === 401) {
          setError("Invalid Credentials");
          setOpen(true)
        } else {
          setError("An error has occured. Please try again.");
          setOpen(true)
        }
      } else {
        const data = await response.json();
        onLogin(data);
      }
    }
    catch {
      setError("An error has occured. Please try again.")
      setOpen(true)
    }    
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
          {error}
        </Alert>
      </Collapse>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h5">Log In</Typography>
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="test@gmail.com"
          error={emailError}
          helperText={emailError ? "Please enter a valid email address" : ""}
          required
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="password"
          required
          error={pwError}
          helperText={pwError ? "Password too short" : ""}
        />
        <Button
          style={{ width: "85px", fontSize: "0.7em" }}
          onClick={handleSubmit}
          variant="contained"
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}

export default LoginForm;
