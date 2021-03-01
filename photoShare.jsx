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
            current_user: undefined // auto login
        }

        // axios.get('/admin/current').then(res => { changeUser(res.data) })
        //     .catch((err) => { this.setState({ current_user: undefined }) }); // session, take back user info

    }

    // method not need to 'var'
    changeUser = (user) => {
        this.setState({ current_user: user });
        console.log(this.state.current_user);
    };

    render() {
        let Page = this.state.current_user ? Panel : Login;
        return (
            <HashRouter>
                <Switch>
                    {this.state.current_user ? <Route component={Panel} /> : <Route path='/login-register' render={() => <Login changeUser={this.changeUser} />} />}
                    {this.state.current_user ? <Route component={Panel} /> : <Redirect to='/login-register' />}
                </Switch>
            </HashRouter>
        )
    }
}

ReactDOM.render(<PhotoApp />, document.getElementById("photoshareapp"));
