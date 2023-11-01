import { createContext } from 'react';

export const UserContext = createContext({
  username: null,
});

export const AppContext = createContext({
  theme: 'dark',
});
