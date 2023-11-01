import Title from '../components/Title';
import StandardLayout from '../layouts/StandardLayout';

function NotFound() {
  return (
    <StandardLayout
      activePage="404"
      title="404 | Page Not Found"
    ></StandardLayout>
  );
}

export default NotFound;
