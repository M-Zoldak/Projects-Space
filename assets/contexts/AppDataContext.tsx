import { PropsWithChildren, createContext, useContext } from "react";
import { useState } from "react";
import { AppType } from "../interfaces/EntityTypes/AppType";
import { UserType } from "../interfaces/EntityTypes/UserType";

interface AppDataType {
  currentAppId: string;
  currentUser: UserType;
  apps: Array<AppType>;
  token: string;
}

type AppDataContextType = {
  appData: AppDataType;
  setAppId: (currentAppId: string) => void;
  setUser: (currentUser: UserType) => void;
  setApps: (apps: Array<AppType>) => void;
  setToken: (token: string) => void;
  clear: () => void;
};

const AppDataContext = createContext<AppDataContextType>(null);

export const useAppDataContext = () =>
  useContext(AppDataContext) as AppDataContextType;

export default function AppDataProvider({ children }: PropsWithChildren) {
  const [appData, setAppData] = useState<AppDataType>({
    apps: JSON.parse(localStorage.getItem("appsData")),
    token: localStorage.getItem("token"),
    currentAppId: localStorage.getItem("currentAppId"),
    currentUser: JSON.parse(localStorage.getItem("currentUser")),
  } as AppDataType);

  const setAppId = (currentAppId: string) => {
    localStorage.setItem("currentAppId", currentAppId);
    setAppData({ ...appData, currentAppId });
  };

  const setUser = (currentUser: UserType) => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    setAppData({ ...appData, currentUser });
  };

  const setApps = (apps: Array<AppType>) => {
    localStorage.setItem("appsData", JSON.stringify(apps));
    setAppData({ ...appData, apps });
  };

  const setToken = (token: string) => {
    localStorage.setItem("token", token);
    setAppData({ ...appData, token });
  };

  const clear = () => {
    setAppData({} as AppDataType);
  };

  return (
    <AppDataContext.Provider
      value={{
        appData,
        setAppId,
        setUser,
        setApps,
        setToken,
        clear,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
