import React from "react";
// import "./userDetail.css";
import { Link } from "react-router-dom";
// import Mention from "./Mention";
import axios from "axios";
import { Button, Card } from "react-bootstrap";
import Mention from "./Mention";

const DETAILS = "Info about ";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined
        };
        this.refreshProfile();
    }

    componentDidUpdate = () => {
        this.refreshProfile();
    };

    refreshProfile = () => {
        let _id = this.props.match.params._id;
        axios
            .get(`/user/${_id}`)
            .then(res => {
                this.setState({ user: res.data });
            })
            .catch(err => console.log(err.response));
    }

    render() {
        return this.state.user ? (
            <div>
                <Card>
                    <Card.Title>{this.state.user.nickName}</Card.Title>
                    <Card.Body>
                        <Card.Text>{this.state.user.description}</Card.Text>
                    </Card.Body>
                    {this.state.user.isSubscribed && <Button>Subscribe</Button>}
                </Card>
                {this.state.user.isSelf ? <Mention user={this.state.user} /> : <h1>hot Photos</h1>}
            </div>
        ) : (
            <div />
        );
    }
}

module.exports = Profile;