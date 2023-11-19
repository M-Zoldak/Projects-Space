import { useEffect, useState } from "react";
import { Button, ButtonToolbar, Form } from "rsuite";
import TextField from "./TextField";
import { DynamicallyFilledObject } from "../../interfaces/DefaultTypes";
import { post } from "../../Functions/Fetch";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { FormDataType } from "../../interfaces/FormDataType";

type FormComponentProps<T> = {
  onSuccess: (data: T) => void;
  formData: Array<FormDataType>;
  setFormData: Function;
  postPath: string;
};

export default function FormComponent<T>({
  onSuccess,
  formData,
  setFormData,
  postPath,
}: FormComponentProps<T>) {
  const { appData } = useAppDataContext();
  const [formValue, setFormValue] = useState<DynamicallyFilledObject>({});

  useEffect(() => {
    let formValues = formData.reduce(
      (data: DynamicallyFilledObject, field: FormDataType) => {
        data[field.name] = field.value;
        return data;
      },
      {}
    );

    setFormValue(formValues);
  }, [formData]);

  const updateInput = (value: string, e: Event) => {
    let editedField = e.target as HTMLInputElement;

    formData = formData.map((field) => {
      if (field.name == editedField.name) {
        field.value = value;
        formValue[field.name] = value;
      }
      return field;
    });

    setFormValue(formValue);
    setFormData(formData);
  };

  const renderField = (field: FormDataType, key: number) => {
    switch (field.type) {
      case "text": {
        return (
          <TextField
            key={key}
            onChange={updateInput}
            error={field.error}
            value={field.value}
            {...field}
          />
        );
      }
      default:
        return (
          <>
            {field.name} does not match any option - Field type not implemented
          </>
        );
    }
  };

  const validateData = () => {
    post<T>(appData.token, postPath, formValue).then((data) => onSuccess(data));
  };

  return (
    <Form>
      {formData.map((field, index) => renderField(field, index))}

      <ButtonToolbar>
        <Button
          appearance="ghost"
          type="submit"
          onClick={validateData}
          onSubmit={validateData}
        >
          Submit
        </Button>
      </ButtonToolbar>
    </Form>
  );
}
