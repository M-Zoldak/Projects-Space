import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Title from '../../components/Title';
import StandardLayout from '../../layouts/StandardLayout';

function Site(props: any) {
    let params = useParams();

    useEffect(() => {
        fetch(`/api/site/${params.id}`)
            .then((res) => res.json())
            .then((data) => console.log(data));
    }, []);

    return <StandardLayout title="Site overview"></StandardLayout>;
}

export default Site;
