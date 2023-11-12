import { Button, FlexboxGrid, Form, Message } from 'rsuite';
import StandardLayout, { MessageInterface } from '../../layouts/StandardLayout';
import TextField from '../../components/Forms/TextField';
import { useEffect, useState } from 'react';
import useToken from '../../components/App/useToken';
import { Link, useParams } from 'react-router-dom';
import CommonList, {
  CommonListItemProps,
} from '../../components/Data/CommonList';
import { get } from '../../Functions/Fetch';
import ContentLoader from '../../components/Loader';

export default function Options() {
  const params = useParams();
  const { token, setToken } = useToken();
  const [loaded, setLoaded] = useState(false);
  const [errorMessages, setErrorMessages] = useState<Array<MessageInterface>>(
    []
  );
  const [apps, setApps] = useState<Array<CommonListItemProps>>([]);

  useEffect(() => {
    get(token, `/api/app/options/${params.id}`)
      .then((data) => {
        // setApps(data.apps);
        setLoaded(true);
      })
      .catch((err: Error) => {
        setErrorMessages([...errorMessages, { text: err.message }]);
      });
  }, []);

  return (
    <StandardLayout
      title="Apps overview"
      activePage="My Apps"
      messages={errorMessages}
    >
      <FlexboxGrid className="buttons_container">
        <Button appearance="ghost" as={Link} to={'/apps'}>
          Back to overview
        </Button>
      </FlexboxGrid>

      <ContentLoader loaded={loaded}>No content yet.</ContentLoader>
    </StandardLayout>
  );
}
