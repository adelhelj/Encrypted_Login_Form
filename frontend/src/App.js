import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Dashboard from "./components/Dashboard";
// Used MUI components for UI: https://mui.com
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

function App() {
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState(false);
  const [signUp, setSignUp] = useState(false);

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
    setLogin(false);
    setSignUp(false);
  };

  const handleHasAccount = () => {
    setLogin(true);
  };

  const handleHasNoAccount = () => {
    setSignUp(true);
  };

  return (
    <Box>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4"> Welcome! </Typography>
          <Typography variant="h6" sx={{ marginBottom: "20px" }}>
            {" "}
            Please choose from the options below:
          </Typography>

          {login ? (
            <Box>
              {" "}
              <LoginForm onLogin={handleLogin} />
              <Button
                onClick={() => {
                  setLogin(false);
                }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Button onClick={handleHasAccount}>
              Log into Existing Account
            </Button>
          )}
          {signUp ? (
            <Box>
              <SignupForm />
              <Button
                onClick={() => {
                  setSignUp(false);
                }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Button onClick={handleHasNoAccount}>Create an Account</Button>
          )}
        </Box>
      )}
    </Box>
  );
}

export default App;
