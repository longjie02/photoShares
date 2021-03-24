import React from "react";
import axios from "axios";
import Media from 'react-bootstrap/Media'
import { ListGroup, Form, InputGroup, Button, Row, Col } from "react-bootstrap";
import { MentionsInput, Mention } from "react-mentions";
import mentionStyle from "./mentionStyle";

const mentionRegex = /@\[(\S+ \S+)( )*\]\(\S+\)/g;

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            newComment: '',
            subs: [],
            mentionsToAdd: []

        };
    }

    componentDidMount() {
        this.refreshComments();

        axios.get('/subscribes')
            .then(res => {
                let subs = res.data.map(val => {
                    return {
                        id: val._id,
                        display: val.nickName
                    }
                });
                this.setState({ subs });
            })
    }

    refreshComments = () => {
        axios.get(`/comments/${this.props.photoId}`)
            .then(res => {
                this.setState({ comments: res.data });
            })
            .catch(err => {
                console.log(err.response);
            })
    }

    handleCommentChange = (event) => {
        this.setState({ newComment: event.target.value });
    }

    handleCommentSubmit = event => {
        event.preventDefault();
        axios.
        post(`/addComment/${this.props.photoId}`, {
            newComment: this.state.newComment,
            mentionsToAdd: this.state.mentionsToAdd
        })
        .then(() => {
            this.setState({
                newComment: '',
                mentionsToAdd: []
            });
            this.refreshComments();
        }).catch(err => {
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
                                <h5>{comment.nickName}</h5>
                                <p>
                                    {comment.text}
                                </p>
                            </Media.Body>
                        </Media>
                    </ListGroup.Item>
                )}
                <Form onSubmit={event => this.handleCommentSubmit(event)}>
                    <Form.Row>
                        <Col xs={11}>
                            <MentionsInput
                                value={this.state.newComment}
                                onChange={this.handleCommentChange}
                                allowSuggestionsAboveCursor
                                style={mentionStyle}
                                // singleLine
                                // className='mr-auto'
                            // className="mention-input-comment"
                            >
                                <Mention
                                    trigger="@"
                                    data={this.state.subs}
                                    displayTransform={(id, display) => `@${display}`}
                                    onAdd={(id) => {
                                        let mentions = this.state.mentionsToAdd;
                                        mentions.push(id);
                                        this.setState({ mentionsToAdd: mentions });
                                    }}
                                />
                            </MentionsInput>
                        </Col>
                        <Col xs={1}>
                            <Button variant="outline-secondary" type='submit' >Post</Button>
                        </Col>
                    </Form.Row>
                </Form>
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