import { AppRoleType } from "./AppRoleType";

export type UserOptionsType = {
  selectedAppId: string;
};

export type CurrentUserType = {
  id: number;
  name: string;
  currentAppRole: AppRoleType;
  userOptions: UserOptionsType;
};

export type UserType = {
  id: number;
  name: string;
  appRole: AppRoleType;
};
