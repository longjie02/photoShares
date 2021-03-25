import React from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import { Container, Col, Row, Nav } from 'react-bootstrap';

import TopBar from "../TopBar/TopBar";
import PhotoList from "../Photos/PhotoList";
import Favorites from "../Favorites/Favorites";
import Subscribes from "./Subscribes";
import Profile from "../Profile/Profile";
import './Panel.css';

class Panel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container fluid className="main-container" style={{marginTop:"4rem"}}>
                <Row>
                    <Col>
                        <TopBar changeUser={this.props.changeUser} user={this.props.user} />
                    </Col>
                </Row>
                <Row className="justify-content-between" style={{ background: 'blue' }}>
                    <Col xs={1} style={{ background: 'yellow' }}>
                        <Subscribes />
                    </Col>
                    <Col xs={7}>
                        <Switch>
                            <Route exact path="/square" render={() => <h1>Square</h1>} />
                            <Route path="/photos/:creatorId" render={props => <PhotoList {...props} key={new Date()} />} />
                            <Route exact path="/favorites" component={Favorites} />
                            <Route path="/profile/:_id" render={(props) => <Profile {...props}/>} />
                            <Redirect to='/square' />
                        </Switch>
                    </Col>
                    <Col xs={1} style={{ background: 'yellow' }}>
                        <h1>text</h1>
                    </Col>
                </Row>
            </Container>
        );
    }
}

module.exports = Panel;