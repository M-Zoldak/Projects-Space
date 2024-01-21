import { useEffect } from "react";
import AppLayout from "../layouts/AppLayout";
import { http_methods } from "../Functions/HTTPMethods";

const Dashboard = () => {
  useEffect(() => {
    http_methods.fetch("/userTasks").then((res) => console.log(res));
  }, null);

  return <AppLayout title="Dashboard" activePage="Dashboard"></AppLayout>;
};

export default Dashboard;
