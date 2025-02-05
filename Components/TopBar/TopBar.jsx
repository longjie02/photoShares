import React from 'react';
// import { Navbar, NavDropdown, Nav, FormControl, Button, Modal, FormLabel, FormGroup, Alert, } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from 'axios';
import './TopBar.css';
import { AppBar, ButtonBase, Toolbar, Link as Link2, IconButton, Badge, Button, Drawer, Menu, MenuItem } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { Modal, FormGroup, FormLabel, FormControl, Alert } from "react-bootstrap";

class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUploadDialog: false,
            uploadErr: '',
            uploadPhotoDescription: "",
            showSubscribes: false,
            anchorProfile: null,
        }
    }

    setShowUploadDiaglog = val => {
        this.setState({
            showUploadDialog: val,
            uploadPhotoDescription: ''
        });
    }

    handleUploadSubmit = event => {
        event.preventDefault();

        const domForm = new FormData();
        let photo = this.uploadInput.files[0];
        if (!photo) {
            this.handleStateChange({ uploadErr: "you have not chosen a photo." });
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

    handleShowPreview = event => {
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

    toggleSubscribes = () => {
        this.setState({ showSubscribes: !this.state.showSubscribes });
    }

    handleProfileOpen = (event) => {
        this.setState({ anchorProfile: event.currentTarget});
    }

    handleProfileClose = () => {
        this.setState({ anchorProfile: null});
    }

    render() {
        return (
            <div className='topbar-holder'>
                <AppBar position="static">
                    <Toolbar>
                        <div style={{ marginRight: 'auto' }}>
                            <ButtonBase href="#/square">
                                <img
                                    alt="logo"
                                    src="favicon.ico"
                                    width="30"
                                    height="30"
                                    style={{ marginRight: '1rem' }}
                                />
                            </ButtonBase>
                            <Button color='inherit' href="#/square" className='topbar-menubutton'>Square</Button>
                            <Button color='inherit' href={`#/photos/${this.props.user._id}`} className='topbar-menubutton'>My Photos</Button>
                            <Button color='inherit' href={`#/favorites`} className='topbar-menubutton'>Favorites</Button>
                            <Button color='inherit' className='topbar-menubutton' onClick={this.toggleSubscribes}>Subscribes</Button>
                        </div>
                        <div>
                            <Button color='secondary' onClick={(e) => this.setShowUploadDiaglog(true, e)}>upload</Button>
                            <IconButton color='inherit' onClick={this.handleProfileOpen}>
                                <Badge badgeContent={5} color='secondary'>
                                    <AccountCircle />
                                </Badge>
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <Modal
                    size="lg"
                    show={this.state.showUploadDialog}
                    onHide={(e) => this.setShowUploadDiaglog(false, e)}
                >
                    <Modal.Header closeButton >
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
                                    onChange={event => this.setState({ uploadPhotoDescription: event.target.value })}
                                />
                            </FormGroup>
                            <Alert variant="danger" className="errormessage" show={this.state.uploadErr ? true : false}>{this.state.uploadErr}</Alert>
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
                <Drawer
                    variant='persistent'
                    ancor='left'
                    open={this.state.showSubscribes}
                >
                    <h1>test</h1>
                </Drawer>
                <Menu
                anchorEl={this.state.anchorProfile}
                // anchorOrigin={{vertical:'bottom', horizontal:'right'}}
                keepMounted
                open={Boolean(this.state.anchorProfile)}
                onClose={this.handleProfileClose}
                >
                    <MenuItem><Link2 href={`#/profile/${this.props.user._id}`}>My Profile </Link2></MenuItem>
                    <MenuItem onClick={this.handleLogout}>Log out</MenuItem>
                </Menu>
            </div>

        );
    }
}

module.exports = TopBar;

{/* <Navbar bg="dark" variant="dark" fixed='top'>
                <Navbar.Brand href="#/square">
                    <img
                        alt="logo"
                        src="favicon.ico"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />
                </Navbar.Brand>
                <Nav defaultActiveKey="#/square" className="mr-auto">
                    <Nav.Item>
                        <Nav.Link href={`#/square`}>Square</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href={`#/photos/${this.props.user._id}`}>My photos</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href={`#/favorites`}>Favorites</Nav.Link>
                    </Nav.Item>
                </Nav>
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <Nav.Link href={`#/profile/${this.props.user._id}`}>My Profile</Nav.Link>
                    <NavDropdown.Divider />
                    <NavDropdown.Item id="topbar-logout" onClick={this.handleLogout}>Log out</NavDropdown.Item>
                </NavDropdown>
                <Button onClick={(e) => this.setShowUploadDiaglog(true, e)}>upload</Button>
                <Modal
                    size="lg"
                    show={this.state.showUploadDialog}
                    onHide={(e) => this.setShowUploadDiaglog(false, e)}
                >
                    <Modal.Header closeButton >
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
                                    onChange={event => this.setState({ uploadPhotoDescription: event.target.value })}
                                />
                            </FormGroup>
                            <Alert variant="danger" className="errormessage" show={this.state.uploadErr ? true : false}>{this.state.uploadErr}</Alert>
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
            </Navbar > */}