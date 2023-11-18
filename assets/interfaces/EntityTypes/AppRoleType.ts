import { PermissionsType } from "../DefaultTypes";

export type AppRoleType = {
  id: number;
  name: string;
  sectionPermissions: Array<SectionPermissionsProps>;
} & PermissionsType;

export type SectionPermissionsProps = {
  id: number;
  roleId: string;
  sectionName: string;
  delete: boolean;
  read: boolean;
  edit: boolean;
};
