export type FormDataType = {
  type: "text" | "date" | "checkbox" | "radio" | "list_readonly" | "list";
  name: string;
  label: string;
  error: string;
  value?: string;
};
