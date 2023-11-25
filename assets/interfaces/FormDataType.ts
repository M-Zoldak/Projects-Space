import { DynamicallyFilledObject } from "./DefaultTypes";

export type FormDataType = {
  fieldType: "text" | "date" | "checkbox" | "radio" | "list_readonly" | "list";
  name: string;
  label: string;
  error: string;
  value?: string;
} & DynamicallyFilledObject<string>;
