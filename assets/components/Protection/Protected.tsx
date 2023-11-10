import { PropsWithChildren, useEffect } from 'react';

import { Navigate } from 'react-router-dom';
import useToken from '../App/useToken';
import Login from '../../pages/Login/Login';

export default function Protected({ children }: PropsWithChildren) {
  const { token, setToken } = useToken();

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  });

  return token ? children : <Navigate to="/login" />;
}
