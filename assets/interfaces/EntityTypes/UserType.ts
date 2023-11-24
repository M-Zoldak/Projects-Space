import { PermissionsType } from "../DefaultTypes";

export type UserOptionsType = {
  selectedAppId: string;
};

export type UserType = {
  id: number;
  name: string;
  userPermissions: UserStandardPermissions;
  userOptions: UserOptionsType;
};

export type UserStandardPermissions = {
  projects: PermissionsType;
  websites: PermissionsType;
  customers: PermissionsType;
  apps: PermissionsType;
};
