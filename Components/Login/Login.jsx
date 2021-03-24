import React from "react";
import axios from 'axios';
import { Card, Tabs, Form, Button, Tab, Alert } from 'react-bootstrap';
import './Login.css';

class RegisterLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task: 'login',
            loginErr: '',
            registerErr: '',

            loginEmail: '',
            loginPassword: '',

            registerNickName: '',
            registerEmail: '',
            registerPassword: '',
            registerConfirmedPassword: ''
        };

        this.handleSwitch = this.handleSwitch.bind(this);
    }

    handleStateChange = stateUpdate => this.setState(stateUpdate);

    handleSwitch(selectedKey) {
        this.setState({ task: selectedKey });
    }

    handleLogin = (event) => {
        event.preventDefault();
        axios
            .post('/admin/login', {
                loginEmail: this.state.loginEmail,
                loginPassword: this.state.loginPassword
            })
            .then(res => {
                this.props.changeUser(res.data);
            })
            .catch(err => {
                this.setState({
                    loginErr: 'Incorrect login name or password, Please try again.'
                });
                console.error('fetchModel error: ', err.response.data);
            });
    }

    handleRegister = (event) => {
        if (this.state.registerPassword !== this.state.registerConfirmedPassword) {
            this.setState({ registerErr: 'Your passwords must match.' });
            return;
        }

        event.preventDefault();
        axios
            .post("/admin/register", {
                registerNickName: this.state.registerNickName,
                registerEmail: this.state.registerEmail,
                registerPassword: this.state.registerPassword,
            })
            .then(res => {
                let user = res.data;
                this.props.changeUser(user);
                console.log(user);
                // window.location.href = `#/forum`;
            })
            .catch(err => {
                console.log(err);
                this.setState({ registerErr: err.response.data });
            })
    }


    render() {
        return (
            <div className="login-canvas">
                <Card className="login-panel">
                    <Tabs defaultActiveKey="login" activeKey={this.state.task} onSelect={this.handleSwitch}>
                        <Tab eventKey="login" title="Log in" />
                        <Tab eventKey="register" title="Register" />
                    </Tabs>
                    {this.state.task === 'login' &&
                        <Form className="login-form" onSubmit={this.handleLogin}>
                            <Form.Group className="login-form-input">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={this.state.loginEmail}
                                    onChange={event => this.handleStateChange({ loginEmail: event.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="login-form-input">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={this.state.loginPassword}
                                    onChange={event => this.handleStateChange({ loginPassword: event.target.value })}
                                />
                            </Form.Group>
                            <Alert variant="danger" className="errormessage" show={this.state.loginErr ? true : false}>{this.state.loginErr}</Alert>

                            <div className="login-form-wrap">
                                <Button className="login-submit" variant="primary" type="submit" >Login</Button>
                            </div>

                        </Form>
                    }

                    {this.state.task === 'register' &&
                        <Form className="register-form" onSubmit={this.handleRegister}>
                            <Form.Group className="login-form-input">
                                <Form.Label>Your Name</Form.Label>
                                <Form.Control
                                    className="login-form-type"
                                    type="text"
                                    value={this.state.registerNickName}
                                    onChange={event => this.handleStateChange({ registerNickName: event.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="login-form-input">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    className="login-form-type"
                                    type="email"
                                    value={this.state.registerEmail}
                                    onChange={event => this.handleStateChange({ registerEmail: event.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="login-form-input">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    className="login-form-type"
                                    type="password"
                                    placeholder="At least 6 characters"
                                    value={this.state.registerPassword}
                                    onChange={event => this.handleStateChange({ registerPassword: event.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="login-form-input">
                                <Form.Label>Confirm password</Form.Label>
                                <Form.Control
                                    className="login-form-type"
                                    type="password"
                                    value={this.state.registerConfirmedPassword}
                                    onChange={event => this.handleStateChange({ registerConfirmedPassword: event.target.value })}
                                />
                            </Form.Group>
                            <Alert variant="danger" className="errormessage" show={this.state.registerErr ? true : false}>{this.state.registerErr}</Alert>
                            <Button className="register-submit" variant="primary" type="submit" block>Create account</Button>
                        </Form>
                    }
                </Card>
            </div>
        );
    }
}

export default RegisterLogin;