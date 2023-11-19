import { PermissionsType } from "../DefaultTypes";

export type AppRoleType = {
  id: number;
  name: string;
  userPermissions: PermissionsType;
};
