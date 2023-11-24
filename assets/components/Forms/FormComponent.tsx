import { SyntheticEvent, useEffect, useState } from "react";
import { Button, ButtonToolbar, CheckboxGroup, DatePicker, Form } from "rsuite";
import TextField from "./TextField";
import { DynamicallyFilledObject } from "../../interfaces/DefaultTypes";
import { http_methods } from "../../Functions/Fetch";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { FormDataType } from "../../interfaces/FormDataType";
import FormError from "./FormError";

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
      appData?.currentUser.userOptions.selectedAppId
        ? { appId: appData.currentUser.userOptions.selectedAppId }
        : {}
    );

    setFormValue(formValues);
  }, [formData]);

  const updateInput = (value: string, fieldName: string) => {
    let data = formData.map((field) => {
      if (field.name == fieldName) {
        field.value = value;
        formValue[field.name] = value;
      }
      return field;
    });

    setFormValue({ ...formValue });
    setFormData(data);
  };

  const renderField = (field: FormDataType, key: number) => {
    switch (field.fieldType) {
      case "text": {
        return (
          <TextField
            key={key}
            onChange={(val: any) => updateInput(val, field.name)}
            error={field.error}
            value={field.value}
            {...field}
          />
        );
      }

      case "date": {
        return (
          <Form.Group controlId={field.name} key={key}>
            <Form.ControlLabel>Date of birth</Form.ControlLabel>
            <Form.Control
              name={field.name}
              accepter={DatePicker}
              onChange={(value) => updateInput(value, field.name)}
              oneTap
              format="yyyy-MM-dd"
            />
            <FormError error={field.error} />
          </Form.Group>
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
    http_methods
      .post<T>(postPath, formValue, appData.token)
      .then((data) => onSuccess(data))
      .catch((res) => {
        console.log(res);
        console.log(" res from Validate");
      });
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
