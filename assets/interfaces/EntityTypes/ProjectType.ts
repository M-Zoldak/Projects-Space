import { PermissionsType } from "../DefaultTypes";
import { DefaultType } from "./DefaultType";

export type ProjectType = DefaultType & {
  appId: number;
} & PermissionsType;
