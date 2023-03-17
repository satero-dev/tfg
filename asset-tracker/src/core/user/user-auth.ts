import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Action } from "../../middleware/actions";

// Estructura de constante userAuth
export const userAuth = {
  login: (action: Action) => {
    const auth = getAuth();
    let user = action.payload.user;
    let pass = action.payload.pass;

    user = "satero@tauli.cat";
    pass = "T0t0r0!!";

    signInWithEmailAndPassword(auth, user, pass)
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
