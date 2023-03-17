/*Obtenemos el estado, que controla la interfaz gráfica del usuario,
y los tipos de acción que podemos realizar */

//(TS) Declaramos el tipo ActionType que contiene los tipos de acción posible
export type ActionType =
  | "LOGIN"
  | "UPDATE_USER"
  | "LOGOUT"
  | "START_MAP"
  | "REMOVE_MAP";

/*La interface Action contiene type (el tipo de acción) y payload (convención para referirnos a 
los datosque necesita una acción para funcionar correctamente) */
export interface Action {
  type: ActionType;
  payload?: any;
}
