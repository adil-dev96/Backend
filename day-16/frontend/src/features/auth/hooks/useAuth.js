import { useContext } from "react";
import { authContext } from "../auth.context.jsx";

export function useAuth() {
  const context = useContext(authContext);

  return context;
}
