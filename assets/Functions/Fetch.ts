import { DynamicallyFilledObject } from "../interfaces/DefaultTypes";

async function post<T>(
  path: string,
  body: DynamicallyFilledObject<string> | Array<any>,
  token?: string
): Promise<T> {
  return await fetch(`/api${path}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  }).then(processResponse);
}

async function put<T>(
  path: string,
  body: DynamicallyFilledObject<any> | Array<any>,
  token?: string
): Promise<T> {
  return await fetch(`/api${path}`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  }).then(processResponse);
}

async function fetchObject<T>(token: string, path: string): Promise<T> {
  return await fetch(`/api${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(processResponse);
}

async function fetchAll<T>(token: string, path: string): Promise<Array<T>> {
  return await fetchObject<Array<T>>(token, `${path}`);
}

async function sendDelete<T>(token: string, path: string): Promise<T> {
  return await fetch(`/api${path}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then(processResponse);
}

const processResponse = (res: Response) => {
  // console.log(res);
  if (res.status >= 200 && res.status <= 299) return res.json();
  // try {
  else
    return res.json().then((errorData) => {
      throw new Error(JSON.stringify(errorData));
    });
};

export const http_methods = {
  post,
  put,
  fetch: fetchObject,
  fetchAll,
  delete: sendDelete,
};
