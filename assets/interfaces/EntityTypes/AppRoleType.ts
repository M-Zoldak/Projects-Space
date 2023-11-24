import { PermissionsType } from "../DefaultTypes";

export type AppRoleType = {
  id: number;
  name: string;
  isOwnerRole: boolean;
  permissions: UserStandardPermissions;
};

export type UserStandardPermissions = {
  projects?: PermissionsType;
  websites?: PermissionsType;
  customers?: PermissionsType;
  apps: PermissionsType;
};
