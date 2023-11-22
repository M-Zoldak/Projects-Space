import { PermissionsType } from "../DefaultTypes";

export type UserOptionsType = {
  currentAppId: string;
};

export type UserType = {
  id: number;
  name: string;
  userPermissions: {
    projects: PermissionsType;
    websites: PermissionsType;
    customers: PermissionsType;
    apps: PermissionsType;
  };
  options: UserOptionsType;
};
