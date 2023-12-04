import { HTMLInputTypeAttribute } from "react";
import { DynamicallyFilledObject } from "./DefaultTypes";

export type FormDataType = {
  type: HTMLInputTypeAttribute;
  name: string;
  label: string;
  error: string;
  value?: string;
} & DynamicallyFilledObject<string>;
