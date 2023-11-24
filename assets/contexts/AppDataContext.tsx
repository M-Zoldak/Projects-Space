import { PropsWithChildren, createContext, useContext } from "react";
import { useState } from "react";
import { AppType } from "../interfaces/EntityTypes/AppType";
import {
  UserStandardPermissions,
  UserType,
} from "../interfaces/EntityTypes/UserType";
import { PermissionsType } from "../interfaces/DefaultTypes";
import { http_methods } from "../Functions/Fetch";
import { redirect } from "react-router-dom";

interface AppDataType {
  currentUser?: UserType;
  apps?: Array<AppType>;
  token?: string;
}

type AppDataContextType = {
  appData: AppDataType;
  initializeAppData: (token: string) => Promise<boolean>;
  updateAppData: (appData: AppDataType) => void;
  addApp: (app: AppType) => void;
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
    getLocalItem("appData") ?? ({} as AppDataType)
  );

  console.log(appData);

  const initializeAppData = async (token: string = "") => {
    if (token || appData.token) {
      return await http_methods
        .fetch<any>(token, "/initial_data")
        .then((data: { user: UserType; apps: AppType[] }) => {
          appData.token = token;
          appData.currentUser = data.user;
          appData.apps = data.apps;
          setAppData({ ...appData });
        })
        .then(() => true);
    } else {
      redirect("/login");
    }
  };

  const updateAppData = (newAppData: AppDataType) => {
    setLocalItem("appData", { ...appData, ...newAppData });
    setAppData({ ...appData, ...newAppData });
  };

  const addApp = (app: AppType) => {
    let apps = [...appData.apps, app];
    updateAppData({ ...appData, apps });
  };

  const clear = () => {
    setAppData({} as AppDataType);
  };

  return (
    <AppDataContext.Provider
      value={{
        appData,
        initializeAppData,
        updateAppData,
        clear,
        addApp,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
