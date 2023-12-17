import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function GuestsOnly({ children }: PropsWithChildren) {
  let token = Cookies.get("token");

  return token ? <Navigate to="/" /> : children;
}
