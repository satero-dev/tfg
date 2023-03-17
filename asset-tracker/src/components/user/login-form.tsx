import React, { ChangeEvent, useState } from "react";
import { useAppContext } from "../../middleware/context-provider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Input } from "@mui/material";
import { Navigate } from "react-router-dom";

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

  if (state.user) {
    return <Navigate to="/map" />;
  }

  return (
    <>
      <TextField
        type="text"
        id="email"
        label="Introduce usuario"
        variant="outlined"
        onChange={(event) => setInputUser(event.target.value)}
      />
      <TextField
        type="password"
        id="password"
        label="Introduce contraseña"
        variant="outlined"
        onChange={(event) => setInputPass(event.target.value)}
      />

      <Button variant="contained" onClick={onLogin}>
        LOGIN
      </Button>
    </>
  );
};
