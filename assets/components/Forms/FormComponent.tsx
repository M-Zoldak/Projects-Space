import { useEffect, useLayoutEffect, useState } from "react";
import {
  Button,
  ButtonToolbar,
  DatePicker,
  Form,
  Input,
  Loader,
  SelectPicker,
} from "rsuite";
import TextField from "./TextField";
import { http_methods } from "../../Functions/HTTPMethods";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { FormDataType } from "../../interfaces/FormDataType";
import FormError from "./FormError";
import { DynamicallyFilledObject } from "../../interfaces/DefaultTypes";

type FormComponentProps<T> = {
  onSuccess: (data: T) => void;
  entity: string;
  updatePath?: {
    id?: string | number;
  };
  prependQuery?: string;
};

export default function FormComponent<T>({
  onSuccess,
  entity,
  updatePath,
  prependQuery = "",
}: FormComponentProps<T>) {
  const { appData } = useAppDataContext();
  const [formFields, setFormFields] = useState<FormDataType[]>([]);
  const [loaded, setLoaded] = useState(true);

  if (prependQuery.endsWith("/")) {
    prependQuery = prependQuery.slice(0, prependQuery.length - 1);
  }

  var loadFormPath = updatePath?.id ? `${updatePath?.id}/options` : "create";
  var sendDataPath = updatePath?.id ? `/${updatePath.id}` : "";

  useEffect(() => {
    http_methods
      .fetch<FormDataType[]>(`${prependQuery}/${entity}/${loadFormPath}`)
      .then((data) => {
        data = data.map((field) => {
          if (field.name == "appId") {
            field.value = appData.currentUser.userOptions.selectedAppId;
          }
          if (field.type == "date") {
            console.log(field.value);
            // try {
            field.value = field.value
              ? new Date(field.value)
              : new Date("2000.01.01");
            // } catch (e) {
            //   field.value = new Date();
            // }
            console.log(field.value);
            // field.value =
          }
          return field;
        });
        setFormFields(data);
      });
  }, []);

  const validateData = async () => {
    setLoaded(false);
    let formValues = formFields.reduce(
      (data: DynamicallyFilledObject<string>, field: FormDataType) => {
        if (field.type == "date") {
          let date = new Date(field.value);
          console.log(field.value);
          console.log(date.getTime());
          data[field.name] = date.getTime().toString();
        } else {
          data[field.name] = field.value;
        }
        return data;
      },
      {}
    );

    updatePath?.id
      ? await http_methods
          .put<T>(`${prependQuery}/${entity}${sendDataPath}`, formValues)
          .then((data) => onSuccess(data))
          .catch((err: Error) => {
            let errors = JSON.parse(err.message);
            let updatedFormFields;
            Object.keys(errors).forEach((key: string) => {
              updatedFormFields = formFields.map((field: FormDataType) => {
                if (field.name == key) field.error = errors[key];
                return field;
              });
            });
            setFormFields(updatedFormFields);
          })
      : await http_methods
          .post<T>(`${prependQuery}/${entity}${sendDataPath}`, formValues)
          .then((data) => onSuccess(data))
          .catch((err: Error) => {
            let errors = JSON.parse(err.message);
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
        return <Input key={key} value={field.value as string} type="hidden" />;
      }
      case "select": {
        return (
          <Form.Group controlId={field.name} key={key}>
            <Form.ControlLabel>{field.label} </Form.ControlLabel>
            <SelectPicker
              searchable={false}
              data={field.options}
              onChange={(v) => updateInput(v?.toString() ?? "", field.name)}
              value={Number.parseInt(field.value as string)}
            />
          </Form.Group>
        );
      }
      case "date": {
        console.log(field.value);
        return (
          <Form.Group controlId={field.name} key={key}>
            <Form.ControlLabel>{field.label}</Form.ControlLabel>
            <DatePicker
              onChange={(value) => updateInput(value.toString(), field.name)}
              name={field.name}
              value={field?.value ? new Date(field.value) : new Date()}
              // limitEndYear={new Date().getFullYear() - 3}
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
          {loaded ? "Submit" : <Loader backdrop />}
        </Button>
      </ButtonToolbar>
    </Form>
  );
}
