import React from 'react'
import { render } from 'react-dom'
import { Modal, Button } from 'react-bootstrap'
import DocumentsForm from './DocumentsForm'
import FontAwesome from 'react-fontawesome'


const DocumentsModal = ({ match, history }) => {
    const personId = match.params.personId;

    const back = (e) => {
        e.stopPropagation()
        history.goBack()
    };

    return (
        <div className="static-modal">
            <Modal show={true}>
                <Modal.Header>
                    <span id="closemodal" onClick={back} ><FontAwesome name='times' /></span>
                    <Modal.Title id="modal-title">Documents</Modal.Title>
                </Modal.Header>
                <Modal.Body id="modal-body">

                    <div>
                        <DocumentsForm personId={personId}/>
                    </div>

                </Modal.Body>
            </Modal>
        </div>
    )
};

export default DocumentsModal;