import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Action } from "../middleware/actions";

// Estructura de constante userAuth
export const userAuth = {
  login: (action: Action) => {
    const auth = getAuth();
    console.log("USERAUTH");
    console.log(action.payload.user);
    console.log("USERAUTH2");
    signInWithEmailAndPassword(auth, action.payload.user, action.payload.pass)
      .then((userCredential) => {
        // Signed in
        //const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        console.log("Error");
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    //const provider = new GoogleAuthProvider();
    //signInWithPopup(auth, provider);
  },

  logout: (action: Action) => {
    const auth = getAuth();
    signOut(auth);
  },
};
