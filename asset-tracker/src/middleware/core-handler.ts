import { userAuth } from "../core/user-auth";
import { Action } from "./actions";

export const executeCore = (action: Action) => {
  if (action.type === "LOGIN") {
    userAuth.login(action);
  }

  if (action.type === "LOGOUT") {
    userAuth.logout(action);
  }
};
