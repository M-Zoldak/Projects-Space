import { useState } from 'react';

export default function useApp() {
  const getApp = () => {
    return localStorage.getItem('app');
  };

  const [appId, setAppId] = useState(getApp());

  const setId = (appId: string) => {
    localStorage.setItem('app', appId.toString());
    setAppId(appId.toString());
  };

  return {
    setAppId: setId,
    appId,
  };
}
