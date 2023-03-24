import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../../middleware/context-provider";
import "./map-viewer.css";

type Props = {
  children?: React.ReactNode;
};

export const MapViewer = ({ children }: Props) => {
  const [state, dispatch] = useAppContext();
  const [isCreating,setIsCreating] = useState(false);
  
  const { user, building} = state;
  const containerRef = useRef(null);

  const onToggleCreate = () => {
    setIsCreating(!isCreating);

  }

  const onCreate = () => {
    if(isCreating) {
      dispatch({ type:"ADD_BUILDING", payload: user})
      setIsCreating(false);      
    }
  }
  
  useEffect(() => {
    const container = containerRef.current;
    if (container && user) {
      dispatch({ type: "START_MAP", payload: { container, user} });
    }

    return () => {
      dispatch({ type: "REMOVE_MAP" });
    };
  }, []);

  if (!state.user) {
    return <Navigate to="/login" />;
  }

  if(building){
    const url=`/building?id=${building}`
    return <Navigate to={url} />
  }

  const onLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <>
      <div
        className="full-screen"
        onContextMenu={onCreate}
        ref={containerRef}
      />
      {isCreating && (
        <div className="overlay">
          <p>Right click to create a new building or</p>
          <Button onClick={onToggleCreate}>cancel</Button>
        </div>
      )}
      <div className="gis-button-container">
        <Button variant="contained" onClick={onToggleCreate}>
          Create building
        </Button>
        <Button variant="contained" onClick={onLogout}>Log out</Button>
      </div>
    </>
  );
};
