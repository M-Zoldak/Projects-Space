import useToken from '../components/App/useToken';
import { SubmitCallbackFullfillmentProps } from '../components/Forms/FormComponent';

export async function post(
  token: string,
  path: string,
  body: {}
): Promise<SubmitCallbackFullfillmentProps> {
  let response: SubmitCallbackFullfillmentProps = {
    success: false,
    data: undefined,
  };

  await fetch(path, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (res.status == 422) {
        response.success = false;
      } else {
        response.success = true;
      }
      return res.json();
    })
    .then((data: {}) => {
      response.data = data;
    });

  return response;
}

export async function get(token: string, path: string) {
  return await fetch(path, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
  });
}
