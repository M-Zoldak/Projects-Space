import StandardLayout from '../../layouts/StandardLayout';
import { useState } from 'react';
import { Button } from 'rsuite';

const Home = () => {
  const [data, setData] = useState('');

  const loadData = async () => {
    await fetch('api/some/info')
      .then((res) => res.json())
      .then((data) => setData(data.dataFromResponse.toString()));
  };

  return (
    <StandardLayout activePage="Home" title="Home">
      <div className="data_container">{data}</div>
      <Button onClick={() => loadData()}>Load Data</Button>
    </StandardLayout>
  );
};

export default Home;
