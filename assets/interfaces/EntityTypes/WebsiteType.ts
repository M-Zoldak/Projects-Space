import { PermissionsType } from "../DefaultTypes";
import { ClientType } from "./ClientType";
import { DefaultType } from "./DefaultType";

export type WebsiteType = DefaultType & {
  id: string | number;
  hosting: string;
  domain: string;
  client: ClientType;
} & PermissionsType;
