import React from "react";
import axios from 'axios';
import { Card, Tabs, Form, Button, Tab, Alert } from 'react-bootstrap';
import './Login.css';

class RegisterLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task: 'login',
            login_err: '',
            register_err: '',

            login_email: '',
            login_password: '',

            register_nickname: '',
            register_email: '',
            register_password: '',
            register_confirmpassword: ''
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
    }

    handleStateChange = stateUpdate => this.setState(stateUpdate);

    handleSwitch(selectedKey) {
        this.setState({ task: selectedKey });
    }

    handleLogin = (event) => {
        event.preventDefault();
        axios
            .post('/admin/signin', {
                email: this.state.login_email,
                password: this.state.login_password
            })
            .then(response => {
                this.props.changeUser(response.data);
                // window.location.href = `#/forum`;
            })
            .catch(err => {
                this.setState({
                    login_err: 'Incorrect login name or password, Please try again.'
                });
                console.error('fetchModel error: ', err.response.data);
            });
    }

    handleRegister = (event) => {
        if (this.state.register_password !== this.state.register_confirmpassword) {
            this.setState({ register_err: 'Your passwords must match.' });
            return;
        }

        event.preventDefault();
        axios
            .post("/admin/register", {
                nickname: this.state.register_nickname,
                email: this.state.register_email,
                password: this.state.register_password,
            })
            .then(response => {
                let current_user = response.data;
                this.props.changeUser(current_user);
                console.log(current_user);
                // window.location.href = `#/forum`;
            })
            .catch(err => {
                console.log(err);
                this.setState({ register_err: err.response.data });
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
                                    value={this.state.login_email}
                                    onChange={event => this.handleStateChange({ login_email: event.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="login-form-input">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={this.state.login_password}
                                    onChange={event => this.handleStateChange({ login_password: event.target.value })}
                                />
                            </Form.Group>
                            <Alert variant="danger" className="errormessage" show={this.state.login_err ? true : false}>{this.state.login_err}</Alert>

                            <div className="login-form-wrap">
                                <Button className="login-submit" variant="primary" type="submit" >Login</Button>
                                {/* <Button variant="danger" type="button" value="_visitor" onClick={this.handleLogin}>Enter as visitor!</Button> */}
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
                                    value={this.state.register_nickname}
                                    onChange={event => this.handleStateChange({ register_nickname: event.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="login-form-input">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    className="login-form-type"
                                    type="email"
                                    value={this.state.register_email}
                                    onChange={event => this.handleStateChange({ register_email: event.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="login-form-input">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    className="login-form-type"
                                    type="password"
                                    placeholder="At least 6 characters"
                                    value={this.state.register_password}
                                    onChange={event => this.handleStateChange({ register_password: event.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="login-form-input">
                                <Form.Label>Confirm password</Form.Label>
                                <Form.Control
                                    className="login-form-type"
                                    type="password"
                                    value={this.state.register_confirmpassword}
                                    onChange={event => this.handleStateChange({ register_confirmpassword: event.target.value })}
                                />
                            </Form.Group>
                            <Alert variant="danger" className="errormessage" show={this.state.register_err ? true : false}>{this.state.register_err}</Alert>
                            <Button className="register-submit" variant="primary" type="submit" block>Create account</Button>
                        </Form>
                    }


                </Card>

            </div>
        );
    }
}

export default RegisterLogin;