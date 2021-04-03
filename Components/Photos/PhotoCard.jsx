import axios from "axios";
import React, { useState } from "react";
// import { Card, Button, ButtonGroup, Row, Col, Container } from "react-bootstrap";
import { Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, IconButton } from '@material-ui/core';
import Comments from "./Comments";
import { CommentOutlined, Favorite, FavoriteBorder, ThumbUp, ThumbUpAltOutlined } from "@material-ui/icons";

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
        <IconButton onClick={handleToggleLike}>
            {isLike ? <ThumbUp /> : <ThumbUpAltOutlined />}
            {props.countLike}
        </IconButton>
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
        <IconButton disabled={props.isFavorite} onClick={handleAddFavorite}>
            {props.isFavorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
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
        this.setState({ showComments: !this.state.showComments });
    }

    render() {
        return (
            <Card className="photocard">
                <CardHeader title={this.props.creator.nickName} />
                <CardMedia >
                    <img src={`/images/${this.props.fileName}`} className='photocard-img'/>
                </CardMedia>

            
                <CardContent variant="body2" color="textSecondary" component="p">
                    {this.props.description}
                </CardContent>
                <CardActions disableSpacing>
                    <LikeButton isLike={this.props.isLike}
                        countLike={this.props.countLike} photoId={this.props.photoId}
                        refreshPhotoList={this.props.refreshPhotoList}
                    />
                    <FavoriteButton isFavorite={this.props.isFavorite} photoId={this.props.photoId}
                        refreshPhotoList={this.props.refreshPhotoList}
                    />
                    <IconButton onClick={this.toggleComments}>
                        <CommentOutlined />
                    </IconButton>
                </CardActions>
                <Collapse in={this.state.showComments} timeout="auto" unmountOnExit>
                    <Comments photoId={this.props.photoId} />
                </Collapse>
            </Card>
        );
    }
}

module.exports = PhotoCard;