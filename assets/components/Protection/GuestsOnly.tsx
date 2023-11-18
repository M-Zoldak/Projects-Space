import { PropsWithChildren, useEffect } from "react";

import useToken from "../App/useToken";
import { redirect } from "react-router-dom";

export default function GuestsOnly({ children }: PropsWithChildren) {
  const { token } = useToken();

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      redirect("/dashboard");
    }
  });

  return children;
}
