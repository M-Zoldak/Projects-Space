import { ButtonToolbar } from "rsuite";
import { http_methods } from "../../../Functions/Fetch";
import { useEffect, useState } from "react";
import { useAppDataContext } from "../../../contexts/AppDataContext";
import { useNotificationsContext } from "../../../contexts/NotificationsContext";
import { useParams } from "react-router-dom";
import StandardLayout from "../../../layouts/StandardLayout";
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
      .fetch<AddressType>(
        appData.token,
        `/clients/${params.id}/addresses/${params.addressId}`
      )
      .then((data) => {
        setAddress(data);
      })
      .catch((err: Error) => {
        addNotification({ text: "test" });
      });
    setLoaded(true);
  }, []);

  //   const updateClientName = () => {
  // http_methods
  //   .put<AddressType>(
  //     `/clients/${client.id}`,
  //     { name: clientName },
  //     appData.token
  //   )
  //   .then((clientData) => {
  //     setClient(clientData);
  //   });
  //   };

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
  //                 .put<AddressType>(
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
    </StandardLayout>
  );
}
