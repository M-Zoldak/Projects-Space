import { PropsWithChildren, useEffect } from 'react';

import useToken from '../App/useToken';
import Home from '../../pages/Regular/Home';
import { Navigate, redirect } from 'react-router-dom';

export default function GuestsOnly({ children }: PropsWithChildren) {
  const { token, setToken } = useToken();

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      redirect('/dashboard');
    }
  });

  return children;
}
