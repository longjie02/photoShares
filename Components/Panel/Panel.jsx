import React from "react";
import { Route, Switch, Redirect } from 'react-router-dom';


import TopBar from "../TopBar/TopBar";
import PhotoList from "../Photos/PhotoList";
import Favorites from "../Favorites/Favorites";
import Profile from "../Profile/Profile";
import './Panel.css';
import { Container } from "@material-ui/core";

class Panel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="main-container">
                <TopBar changeUser={this.props.changeUser} user={this.props.user} />
                <Container maxWidth='sm'>
                    <Switch>
                        <Route exact path="/square" render={() => <h1>Square</h1>} />
                        <Route path="/photos/:creatorId" render={props => <PhotoList {...props} key={new Date()} />} />
                        <Route exact path="/favorites" component={Favorites} />
                        <Route path="/profile/:_id" render={(props) => <Profile {...props} />} />
                        <Redirect to='/square' />
                    </Switch>
                </Container>
            </div>
        );
    }
}

module.exports = Panel;