import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { http_methods } from "../../Functions/HTTPMethods";
import { WebsiteType } from "../../interfaces/EntityTypes/WebsiteType";
import { useAppDataContext } from "../../contexts/AppDataContext";
import StandardView from "../../components/StandardView";
import AppLayout from "../../layouts/AppLayout";

export default function Website() {
  const params = useParams();
  const { appData } = useAppDataContext();
  const [website, setWebsite] = useState<WebsiteType>(null);

  useEffect(() => {
    http_methods.fetch<WebsiteType>(`/websites/${params.id}`).then(setWebsite);
  }, []);

  console.log(website);
  return (
    <AppLayout activePage="Websites" title="Website overview">
      {website && (
        <StandardView
          mainTitle={`${website.domain}`}
          items={[
            {
              items: website,
              subtitle: "Main informations",
              textBlocks: [
                {
                  name: "Client",
                  value: website?.client?.name ?? "No client set",
                },
                {
                  name: "Hosting",
                  value: website?.hosting?.name ?? "No hosting set",
                },
              ],
            },
          ]}
        />
      )}
    </AppLayout>
  );
}
