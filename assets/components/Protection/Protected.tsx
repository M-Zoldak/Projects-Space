import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Protected({ children }: PropsWithChildren) {
  let token = Cookies.get("token");

  return token ? children : <Navigate to="/login" />;
}
