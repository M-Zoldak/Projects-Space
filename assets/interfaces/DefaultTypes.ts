export interface defaultEntityData {
  id: number;
}

export type DynamicallyFilledObject = {
  [key: string]: string;
};

export type ActionButtonsType = {
  hasView?: boolean;
  deleteable?: boolean;
  hasOptions?: boolean;
};

export type PermissionsType = {
  name: string;
} & ActionButtonsType;
