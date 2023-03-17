import { Button } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../../middleware/context-provider";

type Props = {
  children?: React.ReactNode;
};

export const MapViewer = ({ children }: Props) => {
  const [state, dispatch] = useAppContext();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && state.user) {
      dispatch({ type: "START_MAP", payload: canvas });
    }

    return () => {
      dispatch({ type: "REMOVE_MAP" });
    };
  }, []);

  if (!state.user) {
    return <Navigate to="/login" />;
  }

  const onLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <>
      <div className="full-screen" ref={canvasRef} />
      <Button variant="contained" onClick={onLogout}>
        Logout
      </Button>
    </>
  );
};
