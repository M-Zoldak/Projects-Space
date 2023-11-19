import { PermissionsType } from "../DefaultTypes";

export type UserType = {
  id: number;
  name: string;
  userPermissions: PermissionsType;
};
