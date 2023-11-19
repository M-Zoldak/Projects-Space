import { PropsWithChildren, useEffect } from "react";

import { redirect } from "react-router-dom";
import { useAppDataContext } from "../../contexts/AppDataContext";

export default function Protected({ children }: PropsWithChildren) {
  const { appData } = useAppDataContext();

  useEffect(() => {
    if (!appData.token) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      redirect("/login");
    }
  });

  return children;
}
