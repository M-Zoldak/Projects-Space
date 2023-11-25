import { DynamicallyFilledObject, PermissionsType } from "../DefaultTypes";

export type AppRoleType = {
  id: string;
  name: string;
  isOwnerRole: boolean;
  permissions: UserStandardPermissions;
};

export type UserStandardPermissions = {
  projects?: PermissionsType;
  websites?: PermissionsType;
  customers?: PermissionsType;
  apps: PermissionsType;
} & DynamicallyFilledObject<PermissionsType | any>;
