import React from "react";
import axios from "axios";
import Media from 'react-bootstrap/Media'
import { ListGroup } from "react-bootstrap";

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = { comments: [] };
    }

    componentDidMount() {
        this.refreshComments();
    }

    refreshComments = () => {
        axios.get(`/comments/${this.props.photo_id}`)
            .then(res => {
                this.setState({ comments: res.data });
            })
            .catch(err => {
                console.log(err.response);
            })
    }

    render() {
        return (
            <ListGroup className="list-unstyled">
                {this.state.comments.map(comment =>
                    <ListGroup.Item key={comment._id} >
                        <Media>
                            <img
                                width={64}
                                height={64}
                                className="mr-3"
                                src="holder.js/64x64"
                                alt="Generic placeholder"
                            />
                            <Media.Body>
                                <h5>{comment.nickname}</h5>
                                <p>
                                   {comment.text}
                                </p>
                            </Media.Body>
                        </Media>
                    </ListGroup.Item>
                )}
                {/* <Media>
                            <img
                                width={64}
                                height={64}
                                className="mr-3"
                                src="holder.js/64x64"
                                alt="Generic placeholder"
                            />
                            <Media.Body>
                                <h5>List-based media object</h5>
                                <p>
                                    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
                                    ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at,
                                    tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate
                                    fringilla. Donec lacinia congue felis in faucibus.
                                </p>
                            </Media.Body>
                        </Media> */}

            </ListGroup>
        );
    }
}

module.exports = Comments;