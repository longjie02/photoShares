import React from 'react';
import { Navbar, NavDropdown, Nav, Form, FormControl, Button, Modal, FormLabel, FormGroup, Alert } from "react-bootstrap";
import axios from 'axios';
import './TopBar.css';

class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUploadDialog: false,
            upload_err: '',
            uploadPhotoDescription: ""
        }
    }

    handleStateChange = stateUpdate => this.setState(stateUpdate);

    setShowUploadDiaglog = (val, event) => {
        this.setState({
            showUploadDialog: val,
            uploadPhotoDescription: ''
        });
    }

    handleUploadSubmit = (event) => {
        event.preventDefault();

        const domForm = new FormData();
        let photo = this.uploadInput.files[0];
        if (!photo) {
            this.handleStateChange({ upload_err: "you have not chosen a photo." });
            return;
        }

        domForm.append("photo", photo);
        domForm.append("description", this.state.uploadPhotoDescription);

        axios
            .post("/photos/new", domForm)
            .then(() => {
                console.log("upload successes");
                this.setState({
                    showUploadDialog: false,
                });
            })
            .catch(err => console.log("photo upload err: " + err));
    }

    handleLogout = () => {
        axios
            .post("/admin/logout", {})
            .then(() => {
                this.props.changeUser(undefined);
            })
            .catch(err => console.log(err))
    }

    handleShowPreview = (event) => {
        let preview = document.getElementById("topbar-upload-preview");
        let fileInput = event.target;
        let reader = new FileReader();

        preview.src = '';

        // show uploaded photo preview
        reader.onload = function (event) {
            var data = event.target.result; // e.target is the reader;
            preview.src = data;
            // viewIimg.style = "width: 120px;height:80px;float:left; border: 1px solid rgb(140, 238, 241);display: block"
        }
        reader.readAsDataURL(fileInput.files[0]);
    }

    render() {
        return (
            <Navbar bg="dark" variant="dark" fixed='top'>
                <Navbar.Brand href="#home">
                    <img
                        alt="logo"
                        src="favicon.ico"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />
                </Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                    </Nav>
                    {/* <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-success">Search</Button>
                    </Form> */}
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item> */}
                        <NavDropdown.Divider />
                        <NavDropdown.Item id="topbar-logout" onClick={this.handleLogout}>Log out</NavDropdown.Item>
                    </NavDropdown>
                    <Button onClick={(e) => this.setShowUploadDiaglog(true, e)}>upload photo</Button>
                    <Modal
                        size="lg"
                        show={this.state.showUploadDialog}
                        onHide={(e) => this.setShowUploadDiaglog(false, e)}
                    >
                        <Modal.Header closeButton >
                            {/* <Modal.Title id="example-modal-sizes-title-lg">
                                Share your story
                            </Modal.Title> */}
                        </Modal.Header>
                        <Modal.Body>
                            <div id="topbar-upload-previewholder">
                                <img id="topbar-upload-preview" />
                            </div>
                            <form
                                id="topbar-upload-form"
                                onSubmit={this.handleUploadSubmit}>
                                <FormGroup>
                                    <FormLabel>Description:</FormLabel>
                                    <FormControl
                                        as="textarea"
                                        row="4"
                                        value={this.state.uploadPhotoDescription}
                                        onChange={(event) => this.handleStateChange({ uploadPhotoDescription: event.target.value })}
                                    />
                                </FormGroup>
                                <Alert variant="danger" className="errormessage" show={this.state.upload_err ? true : false}>{this.state.upload_err}</Alert>
                                <div className="topbar-upload-submitwrapper">
                                    <FormLabel>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="topbar-upload-form-input"
                                            onChange={this.handleShowPreview}
                                            ref={domFileRef => {
                                                this.uploadInput = domFileRef;
                                            }}
                                        />
                                    </FormLabel>
                                    <Button color="primary" type="submit">Post</Button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

module.exports = TopBar;