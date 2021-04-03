import React from "react";
import PhotoCard from "./PhotoCard";
import axios from "axios";
import './PhotoList.css';

class PhotoList extends React.Component {
    constructor(props) {
        super(props);
        this.creatorId = props.match.params.creatorId;
        this.state = {
            photos: [],
            favoriteIds: []
        };
    }

    componentDidMount() {
        axios.get(`/user/${this.creatorId}`)
            .then(res => {
                this.owner = res.data;
            })
            .catch(err => console.log(err.response));

        this.refreshPhotoList();
    }

    refreshPhotoList = () => {
        axios.get(`/photoList/${this.creatorId}`)
            .then(res => {
                this.setState({ photos: res.data });
            })
            .catch(err => {
                console.log(err.response);
            });
        axios.get('/getFavorites')
            .then(res => {
                let favoriteIds = res.data.map(photo => photo.photoId);
                this.setState({ favoriteIds });
            }).catch(err => console.log(err.response));
    };

    render() {
        return (
            this.state.photos.length > 0 ? 
            <ul>
                {this.state.photos.map(photo =>
                    <PhotoCard refreshPhotoList={this.refreshPhotoList}
                        isFavorite={this.state.favoriteIds.includes(photo.photoId)}
                        {...photo} key={photo.photoId} />)}
            </ul>
            :
            <div> You don't have any photo yet.</div>
        );
    }
}

module.exports = PhotoList;