import React from "react";
import { Route, Switch, Redirect} from 'react-router-dom';
import { Container, Col, Row, Nav } from 'react-bootstrap';
import TopBar from "../TopBar/TopBar";
// import PhotosHolder from "../photosHolder/PhotosHolder"

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
                        <Nav defaultActiveKey="/home" className="flex-column">
                            {/* <Nav.Link href={`#/users/${this.props.current_user.nickname}/forum`}>Forum</Nav.Link>
                            <Nav.Link href={`#/users/${this.props.current_user.nickname}/follows`}>Follows</Nav.Link>
                            <Nav.Link href={`#/photo/${this.props.current_user.user_id}`}>My photos</Nav.Link>
                            <Nav.Link href={`#/users/${this.props.current_user.nickname}/favorites`}>Favorites</Nav.Link>
                            <Nav.Link href={`#/users/${this.props.current_user.nickname}/subscribes`}>Subscribes</Nav.Link>
                            <Nav.Link href={`#/users/${this.props.current_user.nickname}/profile`}>Profile</Nav.Link> */}
                            <Nav.Link eventKey="disabled" disabled>
                                Disabled
                            </Nav.Link>
                        </Nav>
                    </Col>
                    <Col md={{span: 5}}>
                        <Switch>
                            <Route exact path="/forum" render={() => <h1>forum</h1>} />
                            <Route path="/users/:userId/follows" render={() => <h1>follows</h1>} />
                            {/* <Route path="/photo/:userId" render={(props) => <h1>myFavorite</h1>} /> */}
                            {/* <Route path="/photo/:userId" render={(props) => <PhotosHolder setMiddleFunc={this.setMiddleFunc} current_user={this.props.current_user} {...props} />} /> */}
                            <Route path="/users/:userId/favorites" render={() => <h1>favorites</h1>} />
                            <Route path="/users/:userId/subscribes" render={() => <h1>subscribes</h1>} />
                            <Route path="/users/:userId/profile" render={() => <h1>profile</h1>} />
                            <Redirect to={`/forum`} />
                        </Switch>
                    </Col>
                </Row>
            </Container>
        );
    }
}

module.exports =  Panel;