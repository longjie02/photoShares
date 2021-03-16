import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from 'axios'; // RESTful, AJAX

import 'bootstrap/dist/css/bootstrap.min.css';
import './photoShare.css';
// import React Components
import Login from './Components/Login/Login';
import Panel from './Components/Panel/Panel';

class PhotoApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: undefined // auto login
        }
        axios.get('/admin/current').then(res => { this.changeUser(res.data);})
            .catch((err) => { this.changeUser(undefined) }); // session, take back user info

    }

    changeUser = (user) => {
        this.setState({ user: user });
    };

    render() {
        let Page = this.state.user ? Panel : Login;
        return (
    
            <HashRouter>
                <Switch>
                    {this.state.user ? <Route render={props => <Panel user={this.state.user} changeUser={this.changeUser} />} /> : <Route path='/login-register' render={() => <Login changeUser={this.changeUser} />} />}
                    {!this.state.user && <Redirect to='/login-register' />}
                    {/* {this.state.user ? <Route render={props => <Panel user={this.state.user} changeUser={this.changeUser} />} /> : <Redirect to='/login-register' />} */}
                </Switch>
            </HashRouter>
        )
    }
}

ReactDOM.render(<PhotoApp />, document.getElementById("photoshareapp"));
