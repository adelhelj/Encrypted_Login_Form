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

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = React.useState(false);
  const [emailError, setEmailError] = useState("");
  const [pwError, setPwError] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
        const response = await fetch("http://localhost:8080/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          if (response.status === 409) {
            setError("User Already Exists. Please login!");
            setOpen(true)
          } else {
            setError("An error has occured. Please try again.");
            setOpen(true)
          }
        } else {
          const data = await response.json();
          setError("")
          setMessage(`User ${data.email} created! You can now login.`)
          setOpen(true)
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
          severity={error !== "" ? "error" : "success"}
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
          {error ? error : message}
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
        <Typography variant="h5">Sign Up</Typography>
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
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}

export default SignupForm;
