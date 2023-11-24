import { PermissionsType } from "../DefaultTypes";
import { AppRoleType } from "./AppRoleType";
import { CurrentUserType, UserType } from "./UserType";

export type AppType = {
  id: string;
  name: string;
  userPermissions: PermissionsType;
};

export type AppOptionsType = {
  app: AppType;
  roles: Array<AppRoleType>;
  users: Array<UserType>;
  form: any;
};
