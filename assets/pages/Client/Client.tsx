import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { http_methods } from "../../Functions/HTTPMethods";
import { useAppDataContext } from "../../contexts/AppDataContext";
import StandardView from "../../components/StandardView";
import AppLayout from "../../layouts/AppLayout";
import { ClientType } from "../../interfaces/EntityTypes/ClientType";
import Backlink from "../../components/Buttons/Backlink";
import TabsNavbar from "../../components/Tabs";
import MainTitle from "../../components/Text/MainTitle";
import { Divider } from "rsuite";

export default function Client() {
  const params = useParams();
  const [client, setClient] = useState<ClientType>(null);

  useEffect(() => {
    http_methods.fetch<ClientType>(`/clients/${params.id}`).then(setClient);
  }, []);

  return (
    <AppLayout activePage="Clients" title="Client overview">
      <Backlink link="/clients" />
      {/* <Divider /> */}
      <MainTitle>{client?.name}</MainTitle>
      {client && (
        <TabsNavbar
          items={[
            { label: "Overview", view: <Overview client={client} /> },
            { label: "Employees", view: <Employees client={client} /> },
            { label: "Addresses", view: <Addresses client={client} /> },
          ]}
        />
      )}
    </AppLayout>
  );
}

function Overview({ client }: { client: ClientType }) {
  return (
    <StandardView
      backlink="/clients"
      mainTitle={`${client.name}`}
      items={[
        {
          items: client,
          subtitle: "Quick contact",
          textBlocks: [
            {
              name: "Mobile number",
              value: client?.mobile ?? "No mobile number",
            },
            {
              name: "Phone number",
              value: client?.phone ?? "No phone number",
            },
            {
              name: "Fax",
              value: client?.fax ?? "No Fax number set",
            },
          ],
        },
      ]}
    />
  );
}

function Employees({ client }: { client: ClientType }) {
  return (
    <StandardView
      backlink="/clients"
      mainTitle={`${client.name}`}
      items={[
        {
          items: client.employees,
          subtitle: "Client contacts",
          textBlocks: [
            {
              name: "First name",
              value: "firstName",
              dynamicProp: true,
              title: true,
            },
            {
              name: "Last name",
              value: "lastName",
              dynamicProp: true,
              title: true,
            },
            { name: "Role", value: "role", dynamicProp: true },
            { name: "Email", value: "email", dynamicProp: true },
            { name: "Mobile number", value: "mobile", dynamicProp: true },
            { name: "Phone number", value: "phone", dynamicProp: true },
            { name: "Fax", value: "fax", dynamicProp: true },
          ],
        },
      ]}
    />
  );
}

function Addresses({ client }: { client: ClientType }) {
  return (
    <StandardView
      backlink="/clients"
      mainTitle={`${client.name}`}
      items={[
        {
          items: client.addresses,
          subtitle: "Client addresses",
          textBlocks: [
            {
              name: "Country",
              value: "country",
              dynamicProp: true,
              title: true,
            },
            { name: "City", value: "city", dynamicProp: true },
            { name: "Postal code", value: "postal", dynamicProp: true },
            { name: "Street", value: "street", dynamicProp: true },
          ],
        },
      ]}
    />
  );
}
