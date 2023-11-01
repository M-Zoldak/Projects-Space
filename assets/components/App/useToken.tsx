import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  return {
    setToken: saveToken,
    token,
  };
}
