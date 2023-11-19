import { PermissionsType } from "../DefaultTypes";

export type ProjectType = {
  name: string;
  appId: number;
} & PermissionsType;
