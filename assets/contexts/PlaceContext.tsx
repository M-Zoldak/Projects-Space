import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type AccessControlType = "app" | "portal";
type AccessControlContextType = {
  accessControl: AccessControlType;
  setAccessControl: Dispatch<SetStateAction<AccessControlType>>;
};

const AccessControlContext = createContext<AccessControlContextType>(null);

export const useAccessControlContext = () =>
  useContext(AccessControlContext) as AccessControlContextType;

export default function AccessControlProvider({ children }: PropsWithChildren) {
  const [accessControl, setAccessControl] =
    useState<AccessControlType>("portal");

  return (
    <AccessControlContext.Provider value={{ accessControl, setAccessControl }}>
      {children}
    </AccessControlContext.Provider>
  );
}
