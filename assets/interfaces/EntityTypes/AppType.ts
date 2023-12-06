import { PermissionsType } from "../DefaultTypes";
import { AppRoleType } from "./AppRoleType";
import { UserType } from "./UserType";

export type AppType = {
  id: string;
  ownerId: string;
  name: string;
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
