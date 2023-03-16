import React from "react";

type Props = {
  children?: React.ReactNode;
};

export const MapViewer = ({ children }: Props) => {
  const mensaje: String = "Hello Map!";
  return <div>{mensaje}</div>;
};
