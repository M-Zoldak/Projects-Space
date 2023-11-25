import { DynamicallyFilledObject } from "../interfaces/DefaultTypes";

async function post<T>(
  path: string,
  body: DynamicallyFilledObject<string>,
  token?: string
): Promise<T> {
  return await fetch(`/api${path}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  })
    .then((res) => {
      if (res.status >= 200 && res.status <= 299) return res.json();
      else throw new Error(res.status.toString());
    })
    .catch(errorHandler);
}

async function put<T>(
  path: string,
  body: DynamicallyFilledObject<any>,
  token?: string
): Promise<T> {
  return await fetch(`/api${path}`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  })
    .then((res) => {
      if (res.status >= 200 && res.status <= 299) return res.json();
      else throw new Error(res.status.toString());
    })
    .catch(errorHandler);
}

async function fetchObject<T>(token: string, path: string): Promise<T> {
  return await fetch(`/api${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.status >= 200 && res.status <= 299) return res.json();
    })
    .catch(errorHandler);
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
  })
    .then((res) => {
      if (res.status >= 200 && res.status <= 299) return res.json();
    })
    .catch(errorHandler);
}

const errorHandler = (err: Error) => {
  switch (err.message) {
    case "401":
      throw new Error("Token expired");
    default:
      throw new Error(err.message);
  }
};

export const http_methods = {
  post,
  put,
  fetch: fetchObject,
  fetchAll,
  delete: sendDelete,
};
