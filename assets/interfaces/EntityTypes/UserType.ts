import { AppRoleType } from "./AppRoleType";
import { UserNotificationType } from "./UserNotificationType";

export type UserOptionsType = {
  selectedAppId: string;
};

export type CurrentUserType = {
  id: number;
  name: string;
  currentAppRole: AppRoleType;
  userOptions: UserOptionsType;
  notifications: UserNotificationType[];
  userOwnedAppsIds: Array<number>;
};

export type UserType = {
  id: number;
  name: string;
  appRole: AppRoleType;
};
