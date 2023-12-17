import AppLayout from "../layouts/AppLayout";
import FormComponent from "../components/Forms/FormComponent";
import { useNotificationsContext } from "../contexts/NotificationsContext";

export default function Profile() {
  const { addNotification } = useNotificationsContext();

  return (
    <AppLayout activePage="Profile" title="Profile options">
      <FormComponent<any>
        entity="profile"
        onSuccess={(res) => {
          addNotification({
            text: res.message,
            notificationProps: { type: "success" },
          });
        }}
      />
    </AppLayout>
  );
}
