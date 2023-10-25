import { FlexboxGrid, Panel, ButtonToolbar, Button, Form } from 'rsuite';
import LoginLayout from '../../layouts/LoginLayout';
import React from 'react';

function Registration() {
    return (
        <LoginLayout>
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={12}>
                    <Panel header={<h3>Login</h3>} bordered>
                        <Form fluid>
                            <Form.Group>
                                <Form.ControlLabel>
                                    Username or email address
                                </Form.ControlLabel>
                                <Form.Control name="name" />
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Password</Form.ControlLabel>
                                <Form.Control
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                />
                            </Form.Group>
                            <Form.Group>
                                <ButtonToolbar>
                                    <Button
                                        onClick={() => {
                                            fetch('/createUser')
                                                .then((res) => res.json())
                                                .then((data) =>
                                                    console.log(data)
                                                );
                                        }}
                                        appearance="primary"
                                    >
                                        Sign in
                                    </Button>
                                    <Button appearance="link">
                                        Forgot password?
                                    </Button>
                                </ButtonToolbar>
                            </Form.Group>
                        </Form>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </LoginLayout>
    );
}

export default Registration;
