import { DynamicallyFilledObject } from "../interfaces/DefaultTypes";

async function post<T>(
  token: string,
  path: string,
  body: DynamicallyFilledObject
): Promise<T> {
  return await fetch(`/api${path}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    return res.json();
  });
}

async function fetchObject<T>(token: string, path: string): Promise<T> {
  return await fetch(`/api${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    return res.json();
  });
}

async function fetchAll<T>(token: string, path: string): Promise<Array<T>> {
  return await fetchObject<Array<T>>(token, `${path}`);
}

export const http_methods = {
  post,
  fetch: fetchObject,
  fetchAll,
};
