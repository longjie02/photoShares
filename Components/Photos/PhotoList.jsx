import React from "react";
import PhotoCard from "./PhotoCard";
import axios from "axios";

class PhotoList extends React.Component {
    constructor(props) {
        super(props);
        this.ownerId = props.match.params.ownerId;
        this.state = {
            photoList: [],
            favoriteIdList: []
        };
    }

    componentDidMount() {
        axios.get(`/user/${this.ownerId}`)
            .then(response => {
                this.owner = response.data;
            })
            .catch(e => console.log(e.response));

        this.refreshPhotoList();
    }

    refreshPhotoList = () => {
        axios.get(`/photoList/${this.ownerId}`)
            .then(response => {
                this.setState({ photoList: response.data });
            })
            .catch(e => {
                console.log(e.response);
            });
        axios.get('/getFavorites')
            .then(response => {
                let favoriteIdList = response.data.map(photo => photo._id);
                this.setState({ favoriteIdList });
            }).catch(e => console.log(e.response));
    };

    render() {
        return (
            <div>
                <h1>photoList works.</h1>
                <ul>
                    {this.state.photoList.map(photo =>
                        <PhotoCard refreshPhotoList={this.refreshPhotoList}
                            isFavorite={this.state.favoriteIdList.includes(photo._id)}
                            {...photo} key={photo._id} />)}
                </ul>
            </div>
        );
    }
}

module.exports = PhotoList;