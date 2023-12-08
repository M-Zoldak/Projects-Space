import StandardLayout from "../../layouts/StandardLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { http_methods } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import Backlink from "../../components/Buttons/Backlink";
import InputButtonGroup from "../../components/Forms/InputButtonGroup";
import { ClientType } from "../../interfaces/EntityTypes/ClientType";
import { useAppDataContext } from "../../contexts/AppDataContext";
import FormComponent from "../../components/Forms/FormComponent";
import { ContactPersonType } from "../../interfaces/EntityTypes/ContactPersonType";
import { AddressType } from "../../interfaces/EntityTypes/AddressType";
import CommonList from "../../components/Data/CommonList";
import SimpleCreateModal from "../../components/Modals/SimpleCreateModal";
import { ButtonToolbar } from "rsuite";
import { add } from "@hotwired/stimulus";

export default function ClientOptions() {
  const { appData } = useAppDataContext();
  const { addNotification } = useNotificationsContext();
  const params = useParams();
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState<ClientType>();
  const [clientName, setClientName] = useState("");
  const [contacts, setContacts] = useState<ContactPersonType[]>([]);
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  useEffect(() => {
    http_methods
      .fetch<ClientType>(appData.token, `/clients/${params.id}`)
      .then((data) => {
        setClient(data);
        setClientName(data.name);
        setAddresses(data.addresses);
        setContacts(data.employees);
      })
      .catch((err: Error) => {
        addNotification({ text: "test" });
      });
    setLoaded(true);
  }, []);

  const updateClientName = () => {
    http_methods
      .put<ClientType>(
        `/clients/${client.id}`,
        { name: clientName },
        appData.token
      )
      .then((clientData) => {
        setClient(clientData);
      });
  };

  // const userAdditionalInfo = (user: UserType) => {
  //   const userIsActive = users.find((i) => i.id == user.id) ? true : false;

  //   return (
  //     <FlexboxGrid>
  //       <FlexboxGridItem>
  //         {userIsActive ? (
  //           <HoverTooltip text="User role">
  //             <FontAwesomeIcon icon={faUserTie} /> {user.clientRole.name}
  //           </HoverTooltip>
  //         ) : (
  //           <>
  //             <FontAwesomeIcon icon={faClockFour} /> Pending...
  //           </>
  //         )}
  //       </FlexboxGridItem>
  //     </FlexboxGrid>
  //   );
  // };

  // const clientRoleAdditionalInfo = (item: ClientRoleType) => {
  //   return (
  //     <FlexboxGrid align="middle">
  //       <FlexboxGridItem>
  //         <HoverTooltip text="Check to set as default role for new users">
  //           <FontAwesomeIcon icon={faCreativeCommonsBy} />{" "}
  //           <Radio
  //             checked={item.id == defaultRoleId}
  //             onClick={() => {
  //               http_methods
  //                 .put<ClientType>(
  //                   `/clients/${params.id}/updateDefaultRole`,
  //                   {
  //                     defaultRoleId: item.id,
  //                   },
  //                   clientData.token
  //                 )
  //                 .then((data) => {
  //                   setDefaultRoleId(data.defaultRoleId);
  //                 });
  //             }}
  //           />
  //         </HoverTooltip>
  //       </FlexboxGridItem>
  //     </FlexboxGrid>
  //   );
  // };

  return (
    <StandardLayout
      title={client?.name ? `Client options` : "Loading..."}
      activePage="Clients"
    >
      <Backlink link="/clients" />

      <ContentLoader loaded={loaded}>
        <h2>{client?.name} options</h2>

        <InputButtonGroup
          buttonText="Update client name"
          label="Client name: "
          onChange={(val) => setClientName(val)}
          value={clientName}
          onSubmit={updateClientName}
        />

        <FormComponent<ClientType>
          entity="clients"
          updatePath={{ id: params?.id }}
          onSuccess={() => {
            `Client profile updates succesfully.`;
          }}
        />

        <h3>Contacts</h3>

        {appData.currentUser.currentAppRole.permissions?.clients.hasOptions &&
          contacts && (
            <ButtonToolbar>
              <SimpleCreateModal<ContactPersonType>
                title="New contact"
                entity="contacts"
                prependQuery={`/clients/${params.id}/`}
                onSuccess={(contactPerson) => {
                  setContacts([...contacts, contactPerson]);
                  addNotification({
                    text: `Contact person ${contactPerson.name} was added to ${client.name}!`,
                    notificationProps: {
                      type: "success",
                    },
                  });
                }}
              />
            </ButtonToolbar>
          )}

        <CommonList<ContactPersonType>
          entity="contacts"
          items={contacts}
          inViewBacklink={`/clients/${params.id}/options`}
          linkPrepend={`/clients/${params.id}`}
          label={(contact) => `${contact.firstName} ${contact.lastName}`}
          buttons={{
            deleteable:
              appData.currentUser.currentAppRole.permissions.clients.deleteable,
            hasOptions:
              appData.currentUser.currentAppRole.permissions.clients.hasOptions,
            hasView: false,
          }}
          onDelete={(contact) => {
            let filteredContacts = contacts.filter((c) => c.id != contact.id);
            setContacts(filteredContacts);
            addNotification({
              text: `Contact ${contact.firstName} ${contact.lastName} was deleted.`,
              notificationProps: { type: "success" },
            });
          }}
        />

        <h3>Addresses</h3>

        {appData.currentUser.currentAppRole.permissions?.clients.hasOptions &&
          addresses && (
            <ButtonToolbar>
              <SimpleCreateModal<AddressType>
                title="New address"
                entity="addresses"
                prependQuery={`/clients/${params.id}/`}
                onSuccess={(address) => {
                  setAddresses([...addresses, address]);
                  addNotification({
                    text: `Address [${address.postal}] ${address.city} ${address.street} was added for ${client.name}!`,
                    notificationProps: {
                      type: "success",
                    },
                  });
                }}
              />
            </ButtonToolbar>
          )}

        <CommonList<AddressType>
          entity="addresses"
          items={addresses}
          inViewBacklink={`/clients/${params.id}/options`}
          linkPrepend={`/clients/${params.id}`}
          label={(address) =>
            `[${address.postal}] ${address.city} ${address.street}`
          }
          buttons={{
            deleteable:
              appData.currentUser.currentAppRole.permissions.clients.deleteable,
            hasOptions:
              appData.currentUser.currentAppRole.permissions.clients.hasOptions,
            hasView: false,
          }}
          onDelete={(address) => {
            let filteredContacts = addresses.filter((c) => c.id != address.id);
            setAddresses(filteredContacts);
            addNotification({
              text: `Address [${address.postal}] ${address.city} ${address.street} was deleted.`,
              notificationProps: { type: "success" },
            });
          }}
        />
      </ContentLoader>
    </StandardLayout>
  );
}
