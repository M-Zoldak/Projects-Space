import { Button, FlexboxGrid, Form, Message } from 'rsuite';
import StandardLayout, { MessageInterface } from '../../layouts/StandardLayout';
import TextField from '../../components/Forms/TextField';
import { useEffect, useState } from 'react';
import useToken from '../../components/App/useToken';
import { Link, useLocation } from 'react-router-dom';
import CommonList, {
  CommonListItemProps,
} from '../../components/Data/CommonList';
import { get } from '../../Functions/Fetch';
import ContentLoader from '../../components/Loader';

export default function Index() {
  const location = useLocation();
  const { token, setToken } = useToken();
  const [loaded, setLoaded] = useState(false);
  const [errorMessages, setErrorMessages] = useState<Array<MessageInterface>>(
    []
  );
  const [apps, setApps] = useState<Array<CommonListItemProps>>([]);

  useEffect(() => {
    if (location.state?.message) {
      setErrorMessages([
        ...errorMessages,
        {
          text: location.state.message,
          messageProps: { type: location.state?.type ?? 'error' },
        },
      ]);
    }

    get(token, '/api/apps')
      .then((data) => {
        setApps(data.apps);
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
        <Button color="green" appearance="ghost" as={Link} to={'/app/create'}>
          Create new App
        </Button>
      </FlexboxGrid>

      <ContentLoader loaded={loaded}>
        {!!apps.length ? (
          <CommonList
            items={apps}
            copyable={false}
            entity="app"
            token={token}
            setItems={setApps}
            setErrorMessages={setErrorMessages}
            errorMessages={errorMessages}
          />
        ) : (
          <p>You don't have any apps yet. Create one now!</p>
        )}
      </ContentLoader>
    </StandardLayout>
  );
}
