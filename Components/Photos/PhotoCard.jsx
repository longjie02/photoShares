import axios from "axios";
import React, { useState} from "react";
import { Card, Button, ButtonGroup } from "react-bootstrap";
import { } from "react-bootstrap-icons";
import Comments from "./Comments";

function LikeButton(props) {
    const [isLike, setIsLike] = useState(props.isLike);
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
        this.state = {
            showComments: false
        };
    }

    toggleComments = () => {
        this.setState({showComments: !this.state.showComments});
    }

    render() {
        return (
            <Card className="photocard">
                <Card.Header>Featured</Card.Header>
                <Card.Img variant="top" alt="img doesn't exist" src={`/images/${this.props.fileName}`} />
                <ButtonGroup size="sm">
                    <LikeButton isLike={this.props.isLike}
                        countLike={this.props.countLike} photoId={this.props.photoId}
                        refreshPhotoList={this.props.refreshPhotoList}
                    />
                    <FavoriteButton isFavorite={this.props.isFavorite} photoId={this.props.photoId}
                        refreshPhotoList={this.props.refreshPhotoList}
                    />
                    <Button onClick={this.toggleComments}>Comment</Button>
                </ButtonGroup>
                <Card.Body>
                    <Card.Text>
                        {this.props.description}
                    </Card.Text>
                </Card.Body>
                {this.state.showComments && <Comments photoId={this.props.photoId}/> }
            </Card>
        );
    }
}

module.exports = PhotoCard;