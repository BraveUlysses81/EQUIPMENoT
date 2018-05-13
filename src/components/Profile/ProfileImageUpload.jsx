import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import { uploadProfileImage } from  '../../actions/profileActions'
import {connect} from 'react-redux'




class ProfileImageUpload extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        file: '',
        imagePreviewUrl: ''
    };


    handleSubmit(e) {
        e.preventDefault();
        const person_id = this.props.match.params.person_id
        let picString = this.state.imagePreviewUrl;
        const solution = picString.split(";base64,");
        const ext = solution[0].split("data:image/");
        const pic = solution[1];

        const contentType = `image/${ext[1]}`;



        this.props.uploadProfileImage(person_id, contentType, pic)
            .then(()=> {
                this.props.history.goBack();
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
            //console.log("this is the result attribute inside: " + reader.result);
        }
        reader.readAsDataURL(file);
    }

    handleCancel = (e) => {
        e.stopPropagation()
        this.props.history.goBack()
    }

    render() {
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} />);
        } else {
            $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
        }

        return (
            <div className="static-modal">
                <Modal show={true}>
                    <Modal.Header>
                        <Modal.Title>Update Profile Image</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={(e)=>this.handleSubmit(e)}>
                            <input
                                type="file"
                                onChange={(e)=>this.handleImageChange(e)} />
                        </form>
                        <div >
                            {$imagePreview}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleCancel}>Cancel</Button>
                        <Button
                            bsStyle="primary"
                            type="submit"
                            onClick={(e)=>this.handleSubmit(e)}>Upload Image</Button>

                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default connect(null, { uploadProfileImage })(ProfileImageUpload);