import React from "react";
import { Image, Toast, Modal, Form, InputGroup, Button, Overlay, Tooltip, OverlayTrigger } from "react-bootstrap";
import axios from 'axios';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./Favorites.css"

class ThumbnailImg extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showModal: false };
        console.log(this.props.tags);
    }

    handleShowModal = val => {
        this.setState({
            showModal: val,
            cropParams: {
                unit: "%"
            },
            showTagInput: false,
            tagText: '',
            showTags: false,
        });
    }

    handleDeletePhoto = (event) => {
        axios.delete(`/deleteFavorite/${this.props.photoId}`)
            .then(() => {
                this.props.refreshCards();
            })
            .catch(err => { console.log(err.response) });
    }

    handleDragging = (crop, percentCrop) => {
        this.setState({ cropParams: percentCrop });
    };

    startDrag = () => {
        this.setState({ showTagInput: false });
    };

    endDrag = () => {
        this.setState({ showTagInput: true });
    };

    setShowTags = (bool) => {
        this.setState({ showTags: bool });
    }

    handleTagSubmit = () => {
        let tagPost = {
            x: this.state.cropParams.x,
            y: this.state.cropParams.y,
            width: this.state.cropParams.width,
            height: this.state.cropParams.height,
            nickName: this.state.tagText,
            photoId: this.props.photoId
        };

        axios.post('/addTag', tagPost)
            .then(() => {
                this.setState({
                    tagText: '',
                    showTagInput: false,
                    cropParams: {
                        unit: '%'
                    }
                });
            })
            .catch(err => {
                console.log(err.response);
            });
        this.props.refreshCards();
    };

    handleTagTextChange = event => {
        this.setState({ tagText: event.target.value });
    }
    render() {
        return (
            <React.Fragment>
                <Toast onClose={this.handleDeletePhoto}>
                    <Toast.Header>
                        <div className='mr-auto'>
                            {new Date(this.props.dateTime).toDateString()}
                        </div>
                    </Toast.Header>
                    {/* <Toast.Body> */}
                    <Image thumbnail src={`/images/${this.props.fileName}`} onClick={() => this.handleShowModal(true)} />
                    {/* </Toast.Body> */}
                </Toast>
                <Modal
                    show={this.state.showModal}
                    // size="lg"
                    centered
                    onHide={() => this.handleShowModal(false)}
                >
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body
                        onMouseEnter={() => this.setShowTags(true)}
                        onMouseLeave={() => this.setShowTags(false)}
                    >
                        <ReactCrop
                            src={`/images/${this.props.fileName}`}
                            onChange={(crop, percentCrop) =>
                                this.handleDragging(crop, percentCrop)
                            }
                            crop={this.state.cropParams}
                        >
                            {this.props.tags.map(tag =>
                                <OverlayTrigger key={tag._id} placement='top'
                                    overlay={
                                        <Tooltip id={`toottip-${tag._id}`}>
                                            {tag.nickName}
                                        </Tooltip>
                                    }>
                                    <div className='favorites-tag'
                                        style={{
                                            width: `${tag.width}%`,
                                            height: `${tag.height}%`,
                                            left: `${tag.x}%`,
                                            top: `${tag.y}%`
                                        }}
                                    />
                                </OverlayTrigger>
                            )}
                            {this.state.showTagInput && this.state.cropParams.width > 5 && (
                                <div
                                    className="favorites-tag-input"
                                    style={{
                                        left: `${this.state.cropParams.x}%`,
                                        top: `${this.state.cropParams.y}%`
                                    }}
                                >
                                    <Form onSubmit={this.handleTagSubmit}>
                                        <InputGroup className="mt-3">
                                            <Form.Control
                                                placeholder="Name"
                                                value={this.state.tagText}
                                                onChange={this.handleTagTextChange}
                                            />
                                            <InputGroup.Append>
                                                <Button type="submit" variant="outline-secondary">Button</Button>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </Form>
                                </div>
                            )}
                        </ReactCrop>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        );
    }
}

module.exports = ThumbnailImg