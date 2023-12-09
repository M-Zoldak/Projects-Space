import { PermissionsType } from "../DefaultTypes";
import { AppRoleType } from "./AppRoleType";
import { DefaultType } from "./DefaultType";
import { UserType } from "./UserType";
import { WebsiteOptionsType } from "./WebsiteOptionsType";

export type AppType = DefaultType & {
  ownerId: string;
  userPermissions: PermissionsType;
  defaultRoleId: string;
  statistics: {
    usersCount: number;
  };
  websiteOptions: WebsiteOptionsType;
};

export type AppOptionsType = {
  app: AppType;
  roles: Array<AppRoleType>;
  users: Array<UserType>;
  invitedUsers: Array<UserType>;
  websiteOptions: WebsiteOptionsType;
  form: any;
};
