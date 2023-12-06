import { PropsWithChildren, useEffect } from "react";

import { redirect } from "react-router-dom";
import { useAppDataContext } from "../../contexts/AppDataContext";

export default function Protected({ children }: PropsWithChildren) {
  const { appData, clear } = useAppDataContext();

  return !appData.token ? (
    <>
      {/* {(() => {
        clear();
        redirect("/login");
      })()} */}
    </>
  ) : (
    children
  );
}
