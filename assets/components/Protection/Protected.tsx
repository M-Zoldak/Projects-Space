import { PropsWithChildren, useEffect } from 'react';

import { redirect } from 'react-router-dom';
import useToken from '../App/useToken';

export default function Protected({ children }: PropsWithChildren) {
  const { token, setToken } = useToken();

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      redirect('/login');
    }
  });

  return children;
}
