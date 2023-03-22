import React from "react";

type Props = {
  children?: React.ReactNode;
};

export const BuildingViewer = ({ children }: Props) => {
  const mensaje: String = "Hello Building!";
  return <div>{mensaje}</div>;
};
