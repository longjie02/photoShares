import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ListGroup } from "react-bootstrap";

class Subscribes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subs: []
        }
    }

    componentDidMount() {
        axios.get('/subscribes')
            .then(response =>
                this.setState({ subs: response.data })
            )
            .catch(err => console.log(err.response));
    }

    render() {
        return (
            <ListGroup>
                {
                    this.state.subs.map(sub => <ListGroup.Item key={sub._id}>
                        <Link to={`/photos/${sub._id}`}>{sub.nickname} </Link>
                    </ListGroup.Item>)
                }
            </ListGroup>

        );
    }
}

module.exports = Subscribes;