import { useEffect, useState } from 'react';
import { Button, ButtonToolbar, Form } from 'rsuite';
import TextField from './TextField';
import { DynamicallyFilledObject } from '../../interfaces/DefaultTypes';

export type SubmitCallbackFullfillmentProps = {
  success: boolean;
  data: {
    [key: string]: string;
  };
};

export type FormFieldProps = {
  type: 'text' | 'date' | 'checkbox' | 'radio';
  name: string;
  label: string;
  error: string;
  value?: string;
};

async function SubmitFunction({}): Promise<SubmitCallbackFullfillmentProps> {
  return { success: true, data: {} };
}

const getFormErrors = (formData: Array<FormFieldProps>) => {
  if (formData.length) {
    return formData.reduce((obj, curr) =>
      Object.assign(obj, { [curr.name]: curr.error ?? '' }, {})
    );
  } else return {};
};

function VoidFunctionWithObjectParam({}): void {}

type FormComponentProps = {
  onSubmit: typeof SubmitFunction;
  onSuccess: typeof VoidFunctionWithObjectParam;
  formData: Array<FormFieldProps>;
  setFormData: Function;
};

export default function FormComponent({
  onSubmit,
  onSuccess,
  formData,
  setFormData,
}: FormComponentProps) {
  const [formValue, setFormValue] = useState<DynamicallyFilledObject>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let formValues = formData.reduce(
      (data: DynamicallyFilledObject, field: FormFieldProps) => {
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

  const renderField = (field: FormFieldProps, key: number) => {
    switch (field.type) {
      case 'text': {
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

  const validateData = async () => {
    let res = await onSubmit(formValue);
    if (res.success) onSuccess(res.data);
  };

  return (
    <Form>
      {formData.map((field, index) => renderField(field, index))}

      <ButtonToolbar>
        <Button appearance="ghost" type="submit" onClick={validateData}>
          Submit
        </Button>
      </ButtonToolbar>
    </Form>
  );
}
