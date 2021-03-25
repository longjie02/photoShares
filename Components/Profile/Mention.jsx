import React from "react";
import { ListGroup, Card, Row, Col} from "react-bootstrap";

class Mention extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.user);
    }

    render() {
        return (
            <div>
                <p>mentioned in:</p>
                <ListGroup>
                    {this.props.user.mentioned.length > 0 ? this.props.user.mentioned.map((mention, i) =>
                        <ListGroup.Item key={mention.photoId + i}>
                                <Card>
                                    <Card.Header>
                                        <strong>{new Date(mention.dateTime).toLocaleDateString()}</strong>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xs={9}>
                                                {mention.nickName + ": " + mention.text}
                                            </Col>
                                            <Col xs={3}>
                                                <img src={`/images/${mention.fileName}`} style={{ maxHeight: '6rem' }} />
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                        </ListGroup.Item>
                    ) : <Card>None</Card>}
                </ListGroup>
            </div>
        );
    }
}

module.exports = Mention;