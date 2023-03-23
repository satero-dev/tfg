/*

En este archivo controlamos el estado (state). Para reducir su complejidad usamos el hook "reducer"

useReducer(reducer, initialState) receives a reducer which is just a callback with state and 
action parameters. The callback will return a new state which will replace the old one every 
time a dispatch method is called and it will do so based on the action.

*/

import React from "react";
import { useReducer, createContext, useContext } from "react";
import { Action } from "./actions";
import { Authenticator } from "./authenticator";
import { executeCore } from "./core-handler";
import { Events } from "./event-handler";
import { initialState, State } from "./state";
import { reducer } from "./state-handler";

type Props = {
  children?: React.ReactNode;
};

//Context is designed to share global data that is needed in a component tree.
//These are for instance, the authenticated user, a theme or the preferred language.
const appContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => {},
]);

export const ContextProvider = ({ children }: Props) => {
  const [state, setState] = useReducer(reducer, initialState);

  const events = new Events();
  events.on("OPEN_BUILDING", (buildingID: string) => {
    setState({type:"OPEN_BUILDING", payload: buildingID});
  })

  //Dispatch es la parte de un programa encargada de lanzar un proceso en el servidor de un entorno cliente/servidor
  const dispatch = (value: Action) => {
    setState(value); //Actualizamos la interfaz de usuario
    executeCore(value, events); //Ejecutamos la lógica que queremos en el servidor
  };

  return (
    <appContext.Provider value={[state, dispatch]}>
      <Authenticator />
      {children}
    </appContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(appContext);
};
