import {
  ComponentType,
  PropsWithChildren,
  ReactElement,
  useEffect,
} from 'react';

import {
  Navigate,
  redirect,
  Route,
  RouteObject,
  RouteProps,
} from 'react-router-dom';

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const isAuthenticated = false; // Check the user's authentication status here

  useEffect(() => {
    let authenticationToken = localStorage.getItem('authenticationToken');
    if (authenticationToken) authorize(authenticationToken);
    else redirect('/login');
  });

  const authorize = async (token: string) => {
    await fetch('/authorize', {
      body: JSON.stringify({ token: token }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem('authenticationToken', data.newToken);
      });
  };

  return isAuthenticated ? children : <Navigate to="/register" />;
}
