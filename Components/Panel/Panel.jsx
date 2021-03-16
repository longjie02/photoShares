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

    // setMiddleFunc = (data) => {
    //     this.setState({middleFunc: data});
    // }

    render() {
        return (
            <Container fluid className="main-container">
                <Row>
                    <Col>
                        {/* <TopBar changeUser={this.props.changeUser} middleFunc={this.state.middleFunc}/> */}
                        <TopBar changeUser={this.props.changeUser} />
                        <h1> Top Bar placeholder</h1>
                    </Col>
                </Row>
                <Row className="main-row-content">
                    <Col md={{ span: 1, offset: 3 }}>
                        <Nav defaultActiveKey="#/forum" variant="pills" className="flex-column">
                            {/* <Nav.Link href={`#/users/${this.props.user.nickname}/forum`}>Forum</Nav.Link>
                            <Nav.Link href={`#/users/${this.props.user.nickname}/follows`}>Follows</Nav.Link>
                            <Nav.Link href={`#/photo/${this.props.user.user_id}`}>My photos</Nav.Link>
                            <Nav.Link href={`#/users/${this.props.user.nickname}/favorites`}>Favorites</Nav.Link>
                            <Nav.Link href={`#/users/${this.props.user.nickname}/subscribes`}>Subscribes</Nav.Link>
                            <Nav.Link href={`#/users/${this.props.user.nickname}/profile`}>Profile</Nav.Link>
                            <Nav.Link eventKey="disabled" disabled>
                                Disabled
                            </Nav.Link> */}
                            <Nav.Item>
                                <Nav.Link href={`#/forum`}>Forum</Nav.Link>
                                <Nav.Link href={`#/photos/${this.props.user._id}`}>My photos</Nav.Link>
                                <Nav.Link href={`#/favorites`}>Favorites</Nav.Link>
                            </Nav.Item>
                        </Nav>
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
                </Row>
            </Container>
        );
    }
}

module.exports = Panel;