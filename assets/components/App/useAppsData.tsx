import { useState } from 'react';
import { get } from '../../Functions/Fetch';
import useToken from './useToken';

export default function useAppsData() {
  const getAppsData = (): Array<{ label: string; value: string }> => {
    return JSON.parse(localStorage.getItem('apps_data'));
  };

  const [appsData, setAppsData] = useState(getAppsData());

  const storeAppsData = (appsData: Array<{ label: string; value: string }>) => {
    localStorage.setItem('apps_data', JSON.stringify(appsData));
    setAppsData(appsData);
  };

  return {
    setAppsData: storeAppsData,
    appsData,
  };
}

export function updateAppData() {
  const { token, setToken } = useToken();
  const { appsData, setAppsData } = useAppsData();
  get(token, '/api/apps').then((data) => {
    let appsData = data.apps.map((app: any) => {
      return {
        label: app.name,
        value: app.id.toString(),
      };
    });
    setAppsData(appsData);
  });
}
