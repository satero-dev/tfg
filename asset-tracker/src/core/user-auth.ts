import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { Action } from "../middleware/actions";

// Estructura de constante userAuth
export const userAuth = {
  login: (action: Action) => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  },

  logout: (action: Action) => {
    const auth = getAuth();
    signOut(auth);
  },
};
