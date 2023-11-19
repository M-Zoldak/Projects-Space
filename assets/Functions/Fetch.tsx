import { DynamicallyFilledObject } from "../interfaces/DefaultTypes";

export async function post<T>(
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

export async function get<T>(token: string, path: string): Promise<T> {
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
): Promise<Array<T>> {
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
