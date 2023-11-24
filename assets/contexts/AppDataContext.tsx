import { PropsWithChildren, createContext, useContext } from "react";
import { useState } from "react";
import { AppType } from "../interfaces/EntityTypes/AppType";
import { CurrentUserType } from "../interfaces/EntityTypes/UserType";
import { http_methods } from "../Functions/Fetch";
import { redirect } from "react-router-dom";

interface AppDataType {
  currentUser?: CurrentUserType;
  apps?: Array<AppType>;
  token?: string;
}

type AppDataContextType = {
  appData: AppDataType;
  initializeAppData: (token: string) => Promise<boolean>;
  refreshAppData: () => Promise<boolean>;
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

  const initializeAppData = async (token?: string) => {
    if (token || appData.token) {
      return await http_methods
        .fetch<any>(token ?? appData.token, "/initial_data")
        .then(async (data: { user: CurrentUserType; apps: AppType[] }) => {
          appData.currentUser = await setCurrentUserData(data.user);
          appData.token = token ?? appData.token;
          appData.apps = data.apps;
          setLocalItem("appData", { ...appData });
          setAppData({ ...appData });
        })
        .then(() => true);
    } else {
      redirect("/login");
    }
  };

  const setCurrentUserData = async (
    userData: CurrentUserType
  ): Promise<CurrentUserType> => {
    if (userData.currentAppRole == null) {
      userData.currentAppRole = {
        id: null,
        name: null,
        isOwnerRole: true,
        permissions: {
          apps: {
            name: "apps",
            deleteable: true,
            hasOptions: true,
            hasView: true,
          },
        },
      };
    }
    return userData;
  };

  const refreshAppData = async () => {
    return await initializeAppData();
  };

  const clear = () => {
    localStorage.clear();
    setAppData({} as AppDataType);
  };

  return (
    <AppDataContext.Provider
      value={{
        appData,
        initializeAppData,
        clear,
        refreshAppData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
