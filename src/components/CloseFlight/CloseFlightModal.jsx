import React from 'react'
import { render } from 'react-dom'
import FontAwesome from 'react-fontawesome'
import { Modal, Button } from 'react-bootstrap'


import CloseFlight from './CloseFlight'

const CloseFlightModal = ({ match, history }) => {
    const flightId = match.params.flightId;

    const back = () => {
        history.goBack()
    };

    return (
        <div className="static-modal">
            <Modal show={true} dialogClassName="custom-modal">

                <Modal.Body style={{ border: 'solid black 3px'}}>
                <span id="closemodal" onClick={back} ><FontAwesome name='times' /></span>
                <div>
                    <CloseFlight
                       flightId={flightId}
                       back={back}
                    />
                </div>
                </Modal.Body>

            </Modal>
        </div>
    )

};

export default CloseFlightModal