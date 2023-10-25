import { PropsWithChildren } from 'react';

const Title = ({ children }: PropsWithChildren) => {
    return (
        <div className="container">
            <h2 className="text-center mt-5 mb-3">{children}</h2>
        </div>
    );
};

export default Title;
