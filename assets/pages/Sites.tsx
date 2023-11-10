import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Site } from '../interfaces/SiteInterface';
import { Button } from 'rsuite';
import StandardLayout from '../layouts/StandardLayout';
import useToken from '../components/App/useToken';

function Sites() {
  const { token } = useToken();
  const [sites, setSites] = useState<Array<Site>>([]);
  const [smth, setSmth] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    await fetch('/api/sites', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSites(data));
    setIsLoading(false);
  };

  const deleteSite = async (id: string) => {
    await fetch(`/api/site/delete/${id}`)
      .then((res) => res.text())
      .then((msg) => setSmth(msg));
    fetchSites();
  };

  const renderSites = () => {
    return sites.map((el, index) => (
      <div key={index}>
        <a href={`/site/${el.id}`}>{el.domain}</a>
        <Button
          onClick={() => {
            deleteSite(el.id.toString());
          }}
        >
          Delete <i className="fa-solid fa-trash"></i>
        </Button>
      </div>
    ));
  };

  const renderSitesView = () => {
    return sites.length > 0 ? renderSites() : 'No sites added yet.';
  };

  return (
    <StandardLayout title="Sites Page" activePage="Sites">
      <div>{smth}</div>
      <Link to={'/site/create'}>Add Site</Link>
      {isLoading ? 'Loading...' : renderSitesView()}
      <Button appearance="primary">Click Me!</Button>
    </StandardLayout>
  );
}

export default Sites;
