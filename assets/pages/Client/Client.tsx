import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { http_methods } from "../../Functions/HTTPMethods";
import { useAppDataContext } from "../../contexts/AppDataContext";
import StandardView from "../../components/StandardView";
import AppLayout from "../../layouts/AppLayout";
import { ClientType } from "../../interfaces/EntityTypes/ClientType";
import Backlink from "../../components/Buttons/Backlink";

export default function Client() {
  const params = useParams();
  const [client, setClient] = useState<ClientType>(null);

  useEffect(() => {
    http_methods.fetch<ClientType>(`/clients/${params.id}`).then(setClient);
  }, []);

  return (
    <AppLayout activePage="Clients" title="Client overview">
      {client && (
        <StandardView
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
                { name: "Mobile number", value: "mobile", dynamicProp: true },
                { name: "Phone number", value: "phone", dynamicProp: true },
                { name: "Fax", value: "fax", dynamicProp: true },
              ],
            },
          ]}
        />
      )}
    </AppLayout>
  );
}
