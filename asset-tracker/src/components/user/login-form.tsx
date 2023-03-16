import React, { ChangeEvent, useState } from "react";
import { useAppContext } from "../../middleware/context-provider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Input } from "@mui/material";

type Props = {
  children?: React.ReactNode;
};

export const LoginForm = ({ children }: Props) => {
  const [state, dispatch] = useAppContext();

  const [inputUser, setInputUser] = useState("");
  const [inputPass, setInputPass] = useState("");

  const onLogin = () => {
    console.log("Log in!");
    dispatch({
      type: "LOGIN",
      payload: { user: inputUser, pass: inputPass },
    });
  };

  const onLogout = () => {
    console.log("Log out!");
    setInputUser("");
    setInputPass("");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <h1>
      {state.user ? (
        <>
          <p>Hola {state.user.email}</p>
          <Button variant="contained" onClick={onLogout}>
            LOGOUT
          </Button>
        </>
      ) : (
        <>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              type="text"
              id="email"
              label="Introduce contraseña"
              variant="outlined"
              defaultValue="satero@tauli.ca"
              onChange={(event) => setInputUser(event.target.value)}
            />
            <TextField
              type="password"
              id="password"
              label="Introduce contraseña"
              variant="outlined"
              defaultValue="T0t0r0!"
              onChange={(event) => setInputPass(event.target.value)}
            />
          </Box>

          <Button variant="contained" onClick={onLogin}>
            LOGIN
          </Button>
        </>
      )}
    </h1>
  );
};
