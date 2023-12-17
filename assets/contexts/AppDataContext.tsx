import { PropsWithChildren, createContext, useContext } from "react";
import { useState } from "react";
import { AppType } from "../interfaces/EntityTypes/AppType";
import { CurrentUserType } from "../interfaces/EntityTypes/UserType";
import { http_methods } from "../Functions/HTTPMethods";
import { redirect } from "react-router-dom";
import Cookies from "js-cookie";

interface AppDataType {
  currentUser?: CurrentUserType;
  apps?: Array<AppType>;
}

type AppDataContextType = {
  appData: AppDataType;
  initializeAppData: (apps: Array<AppType>, user: CurrentUserType) => void;
  updateApps: (apps: Array<AppType>) => void;
  updateCurrentUser: (user: CurrentUserType) => void;
  clear: () => void;
};

const setLocalItem = (key: string, item: any) => {
  localStorage.setItem(key, JSON.stringify(item));
};

const getLocalItem = (itemName: string) => {
  return localStorage.getItem(itemName) != "undefined"
    ? JSON.parse(localStorage.getItem(itemName))
    : null;
};

const AppDataContext = createContext<AppDataContextType>(null);

export const useAppDataContext = () =>
  useContext(AppDataContext) as AppDataContextType;

export default function AppDataProvider({ children }: PropsWithChildren) {
  const [appData, setAppData] = useState<AppDataType>(
    getLocalItem("appData") ??
      ({ apps: null, currentUser: null } as AppDataType)
  );

  const initializeAppData = (apps: Array<AppType>, user: CurrentUserType) => {
    appData.apps = apps ?? [];
    appData.currentUser = user ?? null;
    setLocalItem("appData", { ...appData });
    setAppData({ ...appData });
  };

  const updateApps = (apps: AppType[]) => {
    appData.apps = apps ?? [];
    setLocalItem("appData", { ...appData });
    setAppData({ ...appData });
  };

  const updateCurrentUser = (user: CurrentUserType) => {
    appData.currentUser = user ?? null;
    setLocalItem("appData", { ...appData });
    setAppData({ ...appData });
  };

  const clear = () => {
    localStorage.clear();
    setAppData({} as AppDataType);
    Cookies.remove("token");
  };

  return (
    <AppDataContext.Provider
      value={{
        appData,
        initializeAppData,
        updateCurrentUser,
        updateApps,
        clear,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
