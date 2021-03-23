import React from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import { Container, Col, Row, Nav } from 'react-bootstrap';

import TopBar from "../TopBar/TopBar";
import PhotoList from "../Photos/PhotoList";
import Favorites from "../Favorites/Favorites";
import './Panel.css';

class Panel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            middleFunc: undefined
        }
    }

    render() {
        return (
            <Container fluid className="main-container">
                <Row>
                    <Col>
                        <TopBar changeUser={this.props.changeUser} user={this.props.user}/>
                    </Col>
                </Row>
                <Row className="main-row-content">
                    <Col md={{ span: 1, offset: 3 }}>

                    </Col>
                    <Col md={{ span: 5 }}>
                        <Switch>
                            <Route exact path="/forum" render={() => <h1>forum</h1>} />
                            {/* <Route path="/users/:userId/follows" render={() => <h1>follows</h1>} /> */}
                            <Route path="/photos/:ownerId" component={PhotoList} />
                            {/* <Route path="/photo/:userId" render={(props) => <h1>myFavorite</h1>} /> */}
                            {/* <Route path="/photo/:userId" render={(props) => <PhotosHolder setMiddleFunc={this.setMiddleFunc} user={this.props.user} {...props} />} /> */}
                            <Route exact path="/favorites" component={Favorites} />
                            <Route path="/users/:userId/subscribes" render={() => <h1>subscribes</h1>} />
                            <Route path="/users/:userId/profile" render={() => <h1>profile</h1>} />
                            <Redirect to='/forum' />
                        </Switch>
                    </Col>
                    <Col>
                    text
                    </Col>
                </Row>
            </Container>
        );
    }
}

module.exports = Panel;