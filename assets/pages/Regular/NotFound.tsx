import Cookies from "js-cookie";
import AppLayout from "../../layouts/AppLayout";
import PortalLayout from "../../layouts/PortalLayout";
import ErrorPage from "../../components/ErrorPage/ErrorPage";
import { useCookies } from "react-cookie";

function NotFound() {
  const [cookies] = useCookies();
  const token = cookies.token;

  return token ? (
    <AppLayout activePage="404" title="Page Not Found">
      <ErrorPage code={404}>Unfortunately, this site doesn't exist.</ErrorPage>
    </AppLayout>
  ) : (
    <PortalLayout activePage="404" title="Page Not Found">
      <ErrorPage code={404}>Unfortunately, this site doesn't exist.</ErrorPage>
    </PortalLayout>
  );
}

export default NotFound;
