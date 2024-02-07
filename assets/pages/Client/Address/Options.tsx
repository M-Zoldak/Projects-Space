import { ButtonToolbar } from "rsuite";
import { http_methods } from "../../../Functions/HTTPMethods";
import { useEffect, useState } from "react";
import { useAppDataContext } from "../../../contexts/AppDataContext";
import { useNotificationsContext } from "../../../contexts/NotificationsContext";
import { useParams } from "react-router-dom";
import AppLayout from "../../../layouts/AppLayout";
import Backlink from "../../../components/Buttons/Backlink";
import ContentLoader from "../../../components/Loader";
import InputButtonGroup from "../../../components/Forms/InputButtonGroup";
import FormComponent from "../../../components/Forms/FormComponent";
import CommonList from "../../../components/Data/CommonList";
import MainTitle from "../../../components/Text/MainTitle";
import { AddressType } from "../../../interfaces/EntityTypes/AddressType";

export default function AddressOptions() {
  const { appData } = useAppDataContext();
  const { addNotification } = useNotificationsContext();
  const params = useParams();
  const [loaded, setLoaded] = useState(false);
  const [address, setAddress] = useState<AddressType>();

  useEffect(() => {
    http_methods
      .fetch<AddressType>(`/clients/${params.id}/addresses/${params.addressId}`)
      .then(setAddress)
      .catch((err: Error) => {
        addNotification({ text: "test" });
      });
    setLoaded(true);
  }, []);

  return (
    <AppLayout
      title={address ? `Address options` : "Loading..."}
      activePage="Clients"
    >
      <Backlink link={`/clients/${params.id}/options`} />

      <ContentLoader loaded={loaded}>
        <MainTitle>
          {address &&
            `[${address.postal}] ${address.city} ${address.street} options`}
        </MainTitle>

        <FormComponent<AddressType>
          entity="addresses"
          prependQuery={`/clients/${params.id}`}
          updatePath={{ id: params.addressId }}
          onSuccess={(address) => {
            setAddress(address);
            addNotification({
              text: `Address was succesfully updated.`,
              notificationProps: { type: "success" },
            });
          }}
        />
      </ContentLoader>
    </AppLayout>
  );
}
