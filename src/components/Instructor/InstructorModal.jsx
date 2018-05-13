import React from 'react'
import { render } from 'react-dom'
import FontAwesome from 'react-fontawesome'
import { Modal, Button } from 'react-bootstrap'
import PilotCertificateContainer from './PilotCertificateContainer'


const InstructorModal = ({ match, history }) => {
    const personId = match.params.personId;

    const back = (e) => {
        e.stopPropagation();
        history.goBack()
    };

    return (
        <div className="static-modal">
            <Modal show={true}>
                <Modal.Header>
                    <span id="closemodal" onClick={back} ><FontAwesome name='times' /></span>
                    <Modal.Title id="modal-title">Pilot Certificates</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div>
                        <PilotCertificateContainer personId={personId} />
                    </div>

                </Modal.Body>
            </Modal>
        </div>
    )
};

export default InstructorModal;