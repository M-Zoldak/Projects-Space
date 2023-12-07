import { DynamicallyFilledObject, PermissionsType } from "../DefaultTypes";
import { DefaultType } from "./DefaultType";

export type AppRoleType = DefaultType & {
  isOwnerRole: boolean;
  permissions: UserStandardPermissions;
};

export type UserStandardPermissions = {
  projects?: PermissionsType;
  websites?: PermissionsType;
  customers?: PermissionsType;
  apps: PermissionsType;
} & DynamicallyFilledObject<PermissionsType | any>;
