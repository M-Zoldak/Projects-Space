import { Button, FlexboxGrid, Form, Message } from 'rsuite';
import StandardLayout, { MessageInterface } from '../../layouts/StandardLayout';
import TextField from '../../components/Forms/TextField';
import { useEffect, useState } from 'react';
import useToken from '../../components/App/useToken';
import { Link } from 'react-router-dom';
import CommonList, {
  CommonListItemProps,
} from '../../components/Data/CommonList';
import { get } from '../../Functions/Fetch';

export default function Index() {
  const { token, setToken } = useToken();
  const [errorMessages, setErrorMessages] = useState<Array<MessageInterface>>(
    []
  );
  const [apps, setApps] = useState<Array<CommonListItemProps>>([]);

  useEffect(() => {
    get(token, '/api/apps')
      .then((data) => {
        setApps(data.apps);
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
        <Button color="green" appearance="ghost" as={Link} to={'/app/create'}>
          Create new App
        </Button>
      </FlexboxGrid>

      <div>
        <CommonList items={apps} copyable={false} entity="app" />
      </div>
    </StandardLayout>
  );
}
