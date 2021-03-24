import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Accordion, Button, ListGroup, Card, ButtonGroup } from "react-bootstrap";

class Subscribes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subs: []
        }
    }

    componentDidMount() {
        axios.get('/subscribes')
            .then(res => {
                this.setState({ subs: res.data });
            })
            .catch(err => console.log(err.response));

    }

    render() {
        return (
            < Accordion>
                <Accordion.Toggle as={Button} eventKey="0">
                    Subscribes
                 </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <ListGroup>
                        {
                            this.state.subs.map(sub => <ListGroup.Item key={sub._id}>
                                <Link to={`/photos/${sub._id}`}>{sub.nickName} </Link>
                            </ListGroup.Item>)
                        }
                    </ListGroup>
                </Accordion.Collapse>
            </Accordion >
        );
    }
}

module.exports = Subscribes;