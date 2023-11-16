import { Button, FlexboxGrid, Form, Notification } from 'rsuite';
import StandardLayout, {
  NotificationInterface,
} from '../../layouts/StandardLayout';
import TextField from '../../components/Forms/TextField';
import { useEffect, useState } from 'react';
import useToken from '../../components/App/useToken';
import { Link, useLocation } from 'react-router-dom';
import CommonList, {
  CommonListItemProps,
} from '../../components/Data/CommonList';
import { get } from '../../Functions/Fetch';
import ContentLoader from '../../components/Loader';
import { useNotificationsContext } from '../../contexts/NotificationsContext';

export default function AppsList() {
  const location = useLocation();
  const { token, setToken } = useToken();
  const [loaded, setLoaded] = useState(false);
  const { addNotification } = useNotificationsContext();
  const [apps, setApps] = useState<Array<CommonListItemProps>>([]);

  useEffect(() => {
    if (location.state?.notification) {
      addNotification({
        text: location.state.notification,
        notificationProps: { type: location.state?.type ?? 'error' },
      });
    }

    get(token, '/apps')
      .then((data) => {
        setApps(data.apps);
        setLoaded(true);
      })
      .catch((err: Error) => {
        addNotification({ text: 'test' });
      });
  }, []);

  return (
    <StandardLayout title="Apps overview" activePage="My Apps">
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
          />
        ) : (
          <p>You don't have any apps yet. Create one now!</p>
        )}
      </ContentLoader>
    </StandardLayout>
  );
}
