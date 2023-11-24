import StandardLayout from "../layouts/StandardLayout";
import { useEffect, useState } from "react";
import { Button } from "rsuite";
import { useAppDataContext } from "../contexts/AppDataContext";
import { http_methods } from "../Functions/Fetch";
import { UserType } from "../interfaces/EntityTypes/UserType";
import { AppType } from "../interfaces/EntityTypes/AppType";

const Dashboard = () => {
  const [data, setData] = useState("");
  const { appData } = useAppDataContext();

  const loadData = async () => {
    await fetch("api/some/info")
      .then((res) => res.json())
      .then((data) => setData(data.dataFromResponse.toString()));
  };

  return (
    <StandardLayout title="Dashboard" activePage="Dashboard">
      <div className="data_container">{data}</div>
      <Button onClick={() => loadData()}>Load Data</Button>
    </StandardLayout>
  );
};

export default Dashboard;
