import { Button } from "@mui/material";
import React from "react";
import { Navigate } from "react-router";
import { useAppContext } from "../../middleware/context-provider";

type Props = {
  children?: React.ReactNode;
};


export const BuildingViewer = ({ children }: Props) => {

  const [state, dispatch] = useAppContext();
  const { building } = state;

  const onCloseBuilding = () => {
    dispatch({ type: "CLOSE_BUILDING" });
  };

  if (!building) {
    return <Navigate to={"/map"} />
  }

  const mensaje: String = "Hello Building!";
  return (
    <>
      <div>{mensaje}</div>
      <div className="gis-button-container">
        <Button variant="contained" onClick={onCloseBuilding}>
          Close building
        </Button>
      </div>
    </>
  )
};
