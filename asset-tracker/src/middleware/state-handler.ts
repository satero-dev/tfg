// Este fichero recibe acciones y las reenvia al core (Backend) o al state (Frontend)

import { Action } from "./actions";
import { State } from "./state";

export const reducer = (state: State, action: Action) => {
  //Si la acción recibida es "UPDATE_USER" devolvemos el estado y su acción asociada
  if (action.type === "UPDATE_USER") {
    return { ...state, user: action.payload };
  }
  return { ...state }; //Si no se ha cambiado el estado, retornamos el estado original
};
