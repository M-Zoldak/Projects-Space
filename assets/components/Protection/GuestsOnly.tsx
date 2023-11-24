import { PropsWithChildren, useEffect } from "react";

import { redirect } from "react-router-dom";
import { useAppDataContext } from "../../contexts/AppDataContext";

export default function GuestsOnly({ children }: PropsWithChildren) {
  const { appData } = useAppDataContext();

  return appData.token ? <>{redirect("/dashboard")}</> : children;
}
