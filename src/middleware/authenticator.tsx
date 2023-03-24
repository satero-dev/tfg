/*Permite autenticar al usuario en toda la aplicación */
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useAppContext } from "./context-provider";

type Props = {
  children?: React.ReactNode;
};

//En dev mode se llama dos veces a la función, lo evitamos con useEffect
let authInitialized = false;

export const Authenticator = ({ children }: Props) => {
  const auth = getAuth();
  const dispatch = useAppContext()[1]; //Llamomos solo al dispatch, no necesitamos el estado

  //Esta función se llama cuando el usuario se loguea y comprueba si es un usuario
  //registrado en Firebase o no
  const listenToAuthChanges = () => {
    //Adds an observer for changes to the user's sign-in states.
    onAuthStateChanged(auth, (foundUser) => {
      //Si existe el usuario lo copiamos, sino null
      const user = foundUser ? { ...foundUser } : null;
      dispatch({ type: "UPDATE_USER", payload: user });
    });
  };

  useEffect(() => {
    if (!authInitialized) {
      listenToAuthChanges();
      authInitialized = true;
    }
  }, []);

  return <></>;
};
