export interface defaultEntityData {
  id: number;
}

export type DynamicallyFilledObject<T> = {
  [key: string]: T;
};

export type ActionButtonsType = {
  deleteable?: boolean | ((item: any) => boolean);
  hasView?: boolean;
  hasOptions?: boolean;
};

export type PermissionsType = {
  id?: string;
  roleId?: string;
  name?: string;
} & ActionButtonsType &
  DynamicallyFilledObject<any>;
