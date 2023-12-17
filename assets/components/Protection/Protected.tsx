import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAccessControlContext } from "../../contexts/PlaceContext";

export default function Protected({ children }: PropsWithChildren) {
  const { accessControl, setAccessControl } = useAccessControlContext();
  let token = Cookies.get("token");

  setAccessControl("app");

  return token ? children : <Navigate to="/login" />;
}
