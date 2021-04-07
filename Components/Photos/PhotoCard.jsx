import axios from "axios";
import React, { useState } from "react";
// import { Card, Button, ButtonGroup, Row, Col, Container } from "react-bootstrap";
import { Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, IconButton, Typography } from '@material-ui/core';
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
            {isLike ? <ThumbUp color='primary' /> : <ThumbUpAltOutlined color='primary' />}
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
            {props.isFavorite ? <Favorite color='secondary' /> : <FavoriteBorder color='secondary' />}
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
                    <img src={`/images/${this.props.fileName}`} className='photocard-img' />
                </CardMedia>
                <Typography variant='caption' align='center'>
                    {this.props.description}
                </Typography>

                <CardActions disableSpacing>
                    <div style={{ marginRight: 'auto' }}>
                        <LikeButton isLike={this.props.isLike}
                            countLike={this.props.countLike} photoId={this.props.photoId}
                            refreshPhotoList={this.props.refreshPhotoList}
                        />
                        <FavoriteButton isFavorite={this.props.isFavorite} photoId={this.props.photoId}
                            refreshPhotoList={this.props.refreshPhotoList}
                        />
                    </div>
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