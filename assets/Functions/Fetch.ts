import useToken from "../components/App/useToken";
import { SubmitCallbackFullfillmentProps } from "../components/Forms/FormComponent";

export type GetResponse<T> = T;

export type GetAllResponse<T> = Array<T>;
export async function post(
  token: string,
  path: string,
  body: {}
): Promise<SubmitCallbackFullfillmentProps> {
  let response: SubmitCallbackFullfillmentProps = {
    success: false,
    data: undefined,
  };

  await fetch(`/api${path}`, {
    method: "POST",
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

export async function get<T>(
  token: string,
  path: string
): Promise<GetResponse<T>> {
  return await fetch(`/api${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
  });
}

export async function getAll<T>(
  token: string,
  path: string
): Promise<GetAllResponse<T>> {
  return await fetch(`/api${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
  });
}
