import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useCookies } from "react-cookie";

export default function GuestsOnly({ children }: PropsWithChildren) {
  // let token = Cookies.get("token");
  const [cookies] = useCookies();

  return cookies.token ? <Navigate to="/" /> : children;
}
