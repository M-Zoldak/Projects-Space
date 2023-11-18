export interface defaultEntityData {
  id: number;
}

export type DynamicallyFilledObject = {
  [key: string]: string;
};

export type PermissionsType = {
  editable?: boolean;
  destroyable?: boolean;
  copyable?: boolean;
  hasOptions?: boolean;
};
