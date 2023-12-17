import Cookies from "js-cookie";
import { DynamicallyFilledObject } from "../interfaces/DefaultTypes";

async function notTokenizedpost<T>(
  path: string,
  body: DynamicallyFilledObject<string> | Array<any>
): Promise<T> {
  return await fetch(`/api${path}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(processResponse);
}

async function post<T>(
  path: string,
  body: DynamicallyFilledObject<string> | Array<any>
): Promise<T> {
  let token = Cookies.get("token");
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
  body: DynamicallyFilledObject<any> | Array<any>
): Promise<T> {
  let token = Cookies.get("token");
  return await fetch(`/api${path}`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  }).then(processResponse);
}

async function fetchObject<T>(path: string): Promise<T> {
  let token = Cookies.get("token");
  return await fetch(`/api${path}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  }).then(processResponse);
}

async function sendDelete<T>(path: string): Promise<T> {
  let token = Cookies.get("token");
  if (!token) return;
  return await fetch(`/api${path}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then(processResponse);
}

const processResponse = (res: Response) => {
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
  delete: sendDelete,
  notTokenizedpost,
};
