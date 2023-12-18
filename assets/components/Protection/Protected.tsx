import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Protected({ children }: PropsWithChildren) {
  const [cookies] = useCookies();
  return cookies.token ? children : <Navigate to="/login" />;
}
