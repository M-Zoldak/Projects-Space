import { PropsWithChildren, createContext, useContext } from "react";
import { useState } from "react";
import { AppType } from "../interfaces/EntityTypes/AppType";
import { UserType } from "../interfaces/EntityTypes/UserType";
import { PermissionsType } from "../interfaces/DefaultTypes";

interface AppDataType {
  currentAppId: string | null;
  currentUser: UserType;
  apps: Array<AppType>;
  token: string;
}

type AppDataContextType = {
  appData: AppDataType;
  setAppId: (currentAppId: string) => void;
  setUser: (currentUser: UserType) => void;
  setApps: (apps: Array<AppType>) => void;
  addApp: (app: AppType) => void;
  setToken: (token: string) => void;
  clear: () => void;
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
  const [appData, setAppData] = useState<AppDataType>({
    apps: getLocalItem("appsData"),
    token: localStorage.getItem("token"),
    currentAppId: localStorage.getItem("currentAppId"),
    currentUser: getLocalItem("currentUser"),
  });

  console.log(appData.currentUser);

  const setAppId = (currentAppId: string = null) => {
    localStorage.setItem("currentAppId", currentAppId);
    setAppData({ ...appData, currentAppId });
  };

  const setUser = (currentUser: UserType) => {
    if (currentUser.userPermissions) {
      currentUser.userPermissions = Object.assign(
        {},
        // @ts-ignore
        ...currentUser.userPermissions
      );
    }
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    setAppData({ ...appData, currentUser });
  };

  const addApp = (app: AppType) => {
    let apps = [...appData.apps, app];
    localStorage.setItem("appsData", JSON.stringify(apps));
    setAppData({ ...appData, apps });
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
        addApp,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
