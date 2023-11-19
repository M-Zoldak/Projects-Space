export interface defaultEntityData {
  id: number;
}

export type DynamicallyFilledObject = {
  [key: string]: string;
};

export type PermissionsType = {
  hasView?: boolean;
  destroyable?: boolean;
  // copyable?: boolean;
  hasOptions?: boolean;
};
