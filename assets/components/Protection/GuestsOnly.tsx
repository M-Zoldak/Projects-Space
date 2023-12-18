import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useCookies } from "react-cookie";

export default function GuestsOnly({ children }: PropsWithChildren) {
  let cookie;

  if (!cookie) {
    const [cookies] = useCookies();
    cookie = cookies.token;
  }

  return cookie ? <Navigate to="/" /> : children;
}
