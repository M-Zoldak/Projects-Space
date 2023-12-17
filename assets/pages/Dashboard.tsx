import { useEffect } from "react";
import AppLayout from "../layouts/AppLayout";
import { useAppDataContext } from "../contexts/AppDataContext";

const Dashboard = () => {
  const { appData, initializeAppData } = useAppDataContext();

  useEffect(() => {
    if (!appData) initializeAppData;
  }, []);
  return <AppLayout title="Dashboard" activePage="Dashboard"></AppLayout>;
};

export default Dashboard;
