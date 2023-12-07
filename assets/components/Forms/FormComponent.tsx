import { useEffect, useLayoutEffect, useState } from "react";
import { Button, ButtonToolbar, DatePicker, Form, Input, Loader } from "rsuite";
import TextField from "./TextField";
import { http_methods } from "../../Functions/Fetch";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { FormDataType } from "../../interfaces/FormDataType";
import FormError from "./FormError";
import { DynamicallyFilledObject } from "../../interfaces/DefaultTypes";

type FormComponentProps<T> = {
  onSuccess: (data: T) => void;
  entity: string;
};

export default function FormComponent<T>({
  onSuccess,
  entity,
}: FormComponentProps<T>) {
  const { appData } = useAppDataContext();
  const [formFields, setFormFields] = useState<FormDataType[]>([]);
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    http_methods
      .fetchAll<FormDataType>(appData.token, `/${entity}/create`)
      .then((data) => {
        data = data.map((field) => {
          if (field.name == "appId") {
            field.value = appData.currentUser.userOptions.selectedAppId;
          }
          return field;
        });
        setFormFields(data);
      });
  }, []);

  const validateData = () => {
    setLoaded(false);
    let formValues = formFields.reduce(
      (data: DynamicallyFilledObject<string>, field: FormDataType) => {
        data[field.name] = field.value;
        return data;
      },
      {}
    );

    http_methods
      .post<T>(`/${entity}`, formValues, appData.token)
      .then((data) => onSuccess(data))
      .catch((err: Error) => {
        let errors = JSON.parse(err.message);
        console.log(formFields);
        console.log(errors);
        let updatedFormFields;
        Object.keys(errors).forEach((key: string) => {
          updatedFormFields = formFields.map((field: FormDataType) => {
            if (field.name == key) field.error = errors[key];
            return field;
          });
        });
        setFormFields(updatedFormFields);
      });
    setLoaded(true);
  };

  const updateInput = (value: string, fieldName: string) => {
    let form = formFields.map((field) => {
      if (field.name == fieldName && value != field.value) {
        field.value = value;
        field.error = "";
      }
      return field;
    });
    setFormFields(form);
  };

  const renderField = (field: FormDataType, key: number) => {
    switch (field.type) {
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
      case "hidden": {
        return <Input key={key} value={field.value} type="hidden" />;
      }
      case "date": {
        return (
          <Form.Group controlId={field.name} key={key}>
            <Form.ControlLabel>Date of birth</Form.ControlLabel>
            <DatePicker
              onChange={(value) => updateInput(value.toString(), field.name)}
              name={field.name}
              value={
                field?.value ? new Date(field.value) : new Date("01.01.2020")
              }
              // format={field.dateFormat}
              limitEndYear={new Date().getFullYear() - 3}
            />

            <FormError error={field.error} />
          </Form.Group>
        );
      }
      case "password": {
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
      default:
        return (
          <>
            {field.name} does not match any option - Field type not implemented
          </>
        );
    }
  };

  return (
    <Form>
      {formFields &&
        formFields.map((field, index) => renderField(field, index))}

      <ButtonToolbar>
        <Button
          appearance="ghost"
          type="submit"
          onClick={validateData}
          onSubmit={validateData}
        >
          {loaded ? "Submit" : <Loader center />}
        </Button>
      </ButtonToolbar>
    </Form>
  );
}
