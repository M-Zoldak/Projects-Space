import { PermissionsType } from "../DefaultTypes";

export type ProjectType = {
  id: string;
  name: string;
  appId: number;
} & PermissionsType;
