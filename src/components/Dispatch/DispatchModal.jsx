import React from 'react'
import { render } from 'react-dom'
import FontAwesome from 'react-fontawesome'
import { Modal, Button } from 'react-bootstrap'
import FlightDispatch from './FlightDispatch'

const DispatchModal = ({ match, history }) => {
    const schoolId = match.params.schoolId;
    const personId = match.params.personId;

    const back = () => {
        history.goBack()
    };

    return (
        <div className="static-modal">
            <Modal show={true} dialogClassName="flight-modal">

                <Modal.Body id="dispatch-modal-body" style={{ border: 'solid black 3px'}}>
                <span id="closemodal" onClick={back} ><FontAwesome name='times' /></span>
                <div>
                    <FlightDispatch
                        schoolId={schoolId}
                        customerId={personId}
                        // dispatcherId={dispatcherId}
                        back={back}
                    />
                </div>
                </Modal.Body>

            </Modal>

        </div>
    )

};

export default DispatchModal;