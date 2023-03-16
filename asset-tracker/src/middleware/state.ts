import { User } from "firebase/auth";

/* 

A diferencia de las clases, en las interfaces las propiedades no pueden tener valores
y los métodos no pueden tener código para su implementación.

Las interfaces pueden ser redefinidas (añadir más campos)

*/

export interface State {
  user: User | null /*El usuario puede ser un usuario de Firebase o puede no estar logueado, por lo que puede ser null */;
}

//Definimos el estado inicial
export const initialState: State = {
  user: null, //Cuando iniciamos la aplicación, el usuario es null
};
