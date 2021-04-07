import React from "react";
import axios from "axios";
import Media from 'react-bootstrap/Media'
import { ListGroup, Form, InputGroup, Button, Row, Col } from "react-bootstrap";
import { MentionsInput, Mention } from "react-mentions";
import mentionStyle from "./mentionStyle";

const mentionRegex = /@\[(\S+)\]\(\w+\)/g;

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
                            <Media.Body>
                                <h5>{comment.nickName}</h5>
                                <p>
                                    {comment.text.replace(
                                        mentionRegex,
                                        (_, g1) => `@${g1}`
                                    )}
                                </p>
                            </Media.Body>
                        </Media>
                    </ListGroup.Item>
                )}
                <Form onSubmit={event => this.handleCommentSubmit(event)} className="mt-2">
                    <Form.Row>
                        <Col xs={10}>
                            <MentionsInput
                                value={this.state.newComment}
                                onChange={this.handleCommentChange}
                                allowSuggestionsAboveCursor
                                style={mentionStyle}
                            // singleLine
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
                        <Col xs={2}>
                            <Button variant="outline-secondary" type='submit'>Post</Button>
                        </Col>
                    </Form.Row>
                </Form>
            </ListGroup>
        );
    }
}

module.exports = Comments;