import React from "react";
import { Col, Container, Row, Button } from 'react-bootstrap';
import axios from 'axios';

import ThumbnailImg from './ThumbnailImg';

class Favorites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            favorites: [] // photo objects' list; each: {_id, file_name, date_time}
        };
    }

    refreshCards = () => {
        axios
            .get(`/getFavorites`)
            .then(res => {
                this.setState({ favorites: res.data });
                console.log("got favorite photoList.");
            })
            .catch(() => this.setState({ favorites: [] }));
    };

    componentDidMount() {
        this.refreshCards();
    }

    render() {
        return (
            <Container>
                <Row>
                    {this.state.favorites.map(photo =>
                        <Col xs={12} sm={6} md={4} lg={3} key={photo.photoId}>
                            <ThumbnailImg refreshCards={this.refreshCards} {...photo} />
                        </Col>
                    )}
                </Row>
            </Container>
        );
    }
}

module.exports = Favorites;