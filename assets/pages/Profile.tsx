import { useEffect, useState } from "react";
import StandardLayout from "../layouts/StandardLayout";
import { http_methods } from "../Functions/Fetch";
import { useAppDataContext } from "../contexts/AppDataContext";
import { app } from "../bootstrap";
import { FormDataType } from "../interfaces/FormDataType";
import FormComponent from "../components/Forms/FormComponent";
import { useNotificationsContext } from "../contexts/NotificationsContext";

export default function Profile() {
  const { appData } = useAppDataContext();
  const [formData, setFormData] = useState<FormDataType[]>();
  const { addNotification } = useNotificationsContext();

  useEffect(() => {
    // http_methods
    //   .fetch<FormDataType[]>(appData.token, "/profile")
    //   .then(setFormData);
  });

  return (
    <StandardLayout activePage="Profile" title="Profile options">
      <FormComponent<any>
        entity="profile"
        onSuccess={(res) => {
          addNotification({
            text: res.message,
            notificationProps: { type: "success" },
          });
        }}
      />
    </StandardLayout>
  );
}
