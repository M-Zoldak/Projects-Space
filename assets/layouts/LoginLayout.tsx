import {
    Container,
    Header,
    Sidebar,
    Sidenav,
    Content,
    Nav,
    Footer,
    Form,
    ButtonToolbar,
    Button,
    FlexboxGrid,
    Navbar,
    Panel,
} from 'rsuite';

import { CSSProperties, PropsWithChildren, useEffect, useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';

const LoginLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="login-page">
            <Container>
                <Header>
                    <Navbar appearance="inverse">
                        <Navbar.Brand as={Link} to={'/'}>
                            Brand
                        </Navbar.Brand>
                    </Navbar>
                </Header>
                <Content>{children}</Content>
                <Footer>Footer</Footer>
            </Container>
        </div>
    );
};

export default LoginLayout;
