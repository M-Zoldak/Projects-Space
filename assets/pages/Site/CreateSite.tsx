import { useState } from 'react';
import StandardLayout from '../../layouts/StandardLayout';
import { Button } from 'rsuite';

function CreateSite() {
    const [domain, setDomain] = useState('');

    return (
        <StandardLayout title="New site">
            <form action="/api/site" method="POST">
                <div className="form-group">
                    <label htmlFor="domain">Some text</label>
                    <input
                        id="domain"
                        name="domain"
                        type="text"
                        className="form-control"
                        value={domain}
                        onInput={(e) =>
                            setDomain((e.target as HTMLInputElement).value)
                        }
                    />
                </div>
                <Button>Submit</Button>
            </form>
        </StandardLayout>
    );
}

export default CreateSite;
