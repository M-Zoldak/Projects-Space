import { PropsWithChildren, createContext, useContext } from "react";

import { useState } from "react";
import { AppType } from "../interfaces/EntityTypes/AppType";
import { get, getAll } from "../Functions/Fetch";
import { UserType } from "../interfaces/EntityTypes/UserType";

interface AppDataType {
  currentAppId: string;
  currentUser: UserType;
  apps: Array<AppType>;
  token: string;
}

type AppDataContextType = {
  appData: AppDataType;
  setAppId: (appId: string) => void;
  setUser: (user: UserType) => void;
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

  const setAppId = (appId: string) => {
    appData.currentAppId = appId;
    localStorage.setItem("currentAppId", appId);
    setAppData(appData);
  };

  const setUser = (user: UserType) => {
    appData.currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));
    setAppData(appData);
  };

  const setApps = (apps: Array<AppType>) => {
    appData.apps = apps;
    localStorage.setItem("appsData", JSON.stringify(apps));
    setAppData(appData);
  };

  const setToken = (token: string) => {
    appData.token = token;
    localStorage.setItem("token", token);
    setAppData(appData);
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
