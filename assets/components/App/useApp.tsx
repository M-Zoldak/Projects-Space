import { useState } from 'react';

export default function useApp() {
  const getApp = () => {
    return localStorage.getItem('app');
  };

  const [appId, setAppId] = useState(getApp());

  const setApp = (appId: string) => {
    localStorage.setItem('app', appId.toString());
    setAppId(appId.toString());
  };

  return {
    setAppId: setApp,
    appId,
  };
}
