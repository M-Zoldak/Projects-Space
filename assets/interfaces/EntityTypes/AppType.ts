import { PermissionsType } from "../DefaultTypes";
import { AppRoleType } from "./AppRoleType";
import { UserType } from "./UserType";

export type AppType = {
  id: number;
  name: string;
} & PermissionsType;

export type AppOptionsType = {
  app_id: number;
  app_name: string;
  roles: Array<AppRoleType>;
  users: Array<UserType>;
};
