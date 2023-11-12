import { useEffect, useState } from 'react';
import { Button, ButtonToolbar, Form } from 'rsuite';
import TextField from './TextField';

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
  formData: Array<FormFieldProps>;
  onSuccess: typeof VoidFunctionWithObjectParam;
  formValues: {};
};

export default function FormComponent({
  onSubmit,
  formData,
  onSuccess,
  formValues,
}: FormComponentProps) {
  const [formError, setFormError] = useState<{
    [key: string]: string;
  }>({ name: 'jebać' });

  const [formValue, setFormValue] = useState<{
    [key: string]: string;
  }>(formValues);

  const renderField = (field: FormFieldProps, key: number) => {
    switch (field.type) {
      case 'text': {
        return <TextField key={key} error={formError[field.name]} {...field} />;
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
    else setFormError(res.data);
  };

  return (
    <Form onChange={setFormValue} formValue={formValue}>
      {formData.map((field, index) => renderField(field, index))}

      <ButtonToolbar>
        <Button appearance="primary" type="submit" onClick={validateData}>
          Submit
        </Button>
      </ButtonToolbar>
    </Form>
  );
}
