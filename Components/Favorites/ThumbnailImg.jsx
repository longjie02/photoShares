import React from "react";
import { Image, Toast, Modal } from "react-bootstrap";
import axios from 'axios';

class ThumbnailImg extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showModal: false };
    }

    handleShowModal = val => {
        this.setState({showModal: val});
    }

    handleDeletePhoto = (event) => {
        // event.preventDefault();
        axios.delete(`/deleteFavorite/${this.props._id}`)
            .then(() => {
                // this.setState({ show: false });
                this.props.refreshCards();
            })
            .catch(err => { console.log(err.response) });
    }

    render() {
        return (
            <React.Fragment>
                <Toast onClose={this.handleDeletePhoto}>
                    <Toast.Header>
                        <div className='mr-auto'>
                            {new Date(this.props.date_time).toDateString()}
                        </div>
                    </Toast.Header>
                    {/* <Toast.Body> */}
                    <Image thumbnail src={`/images/${this.props.file_name}`} onClick={() => this.handleShowModal(true)}/>
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
                    <Modal.Body>
                        <Image fluid src={`/images/${this.props.file_name}`} />
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        );
    }
}

module.exports = ThumbnailImg