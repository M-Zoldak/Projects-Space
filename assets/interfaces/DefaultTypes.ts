export interface defaultEntityData {
  id: number;
}

export type DynamicallyFilledObject = {
  [key: string]: string;
};

export type ActionButtonsType = {
  deleteable?: boolean | ((item: any) => boolean);
  hasView?: boolean;
  hasOptions?: boolean;
};

export type PermissionsType = {
  name: string;
} & ActionButtonsType;
