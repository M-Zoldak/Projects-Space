import { PermissionsType } from "../DefaultTypes";
import { AppRoleType } from "./AppRoleType";
import { DefaultType } from "./DefaultType";
import { UserType } from "./UserType";

export type AppType = DefaultType & {
  ownerId: string;
  userPermissions: PermissionsType;
  defaultRoleId: string;
  statistics: {
    usersCount: number;
  };
};

export type AppOptionsType = {
  app: AppType;
  roles: Array<AppRoleType>;
  users: Array<UserType>;
  invitedUsers: Array<UserType>;
  form: any;
};
