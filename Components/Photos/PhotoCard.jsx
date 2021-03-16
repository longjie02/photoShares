import axios from "axios";
import React, { useState, useEffect } from "react";
import { Card, Button, ButtonGroup } from "react-bootstrap";
import { } from "react-bootstrap-icons";

function LikeButton(props) {
    const [isLike, setIsLike] = useState(props.isLike);
    // [likeCount, setLikeCount] = useState(props.likeCount);
    function handleToggleLike() {
        axios
            .post(`/toggleLike/${props.photoId}`, { like: !isLike })
            .then(() => {
                setIsLike(!isLike);
                props.refreshPhotoList();
            })
            .catch(err => console.log(err));

    };
    return (
        <Button onClick={handleToggleLike}>{"isLike: " + isLike + " count: " + props.countLike} </Button>
    );
}

function FavoriteButton(props) {
    function handleAddFavorite() {
        axios
            .post(`/addToFavorites`, { photoId: props.photoId })
            .then(() => {
                props.refreshPhotoList();
            })
            .catch(err => console.log(err));
    }
    return (
        <Button disabled={props.isFavorite} onClick={handleAddFavorite}>
            {"isFavorite: " + props.isFavorite}
        </Button>
    );
}

class PhotoCard extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <Card className="photocard">
                <Card.Header>Featured</Card.Header>
                <Card.Img variant="top" alt="img doesn't exist" src={`/images/${this.props.file_name}`} />
                <ButtonGroup size="sm">
                    <LikeButton isLike={this.props.is_like}
                        countLike={this.props.like_num} photoId={this.props._id}
                        refreshPhotoList={this.props.refreshPhotoList}
                    />
                    <FavoriteButton isFavorite={this.props.isFavorite} photoId={this.props._id}
                        refreshPhotoList={this.props.refreshPhotoList}
                    />
                    <Button>Download</Button>
                </ButtonGroup>
                <Card.Body>
                    <Card.Text>
                        {this.props.description}
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">2 days ago</Card.Footer>
            </Card>
        );
    }
}

module.exports = PhotoCard;