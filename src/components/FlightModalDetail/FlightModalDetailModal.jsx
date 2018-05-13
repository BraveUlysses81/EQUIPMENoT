import React from 'react'
import { render } from 'react-dom'
import { Modal, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import FlightModalDetail from './FlightModalDetail'
import './flightmodaldetail.css'



const FlightModalDetailModal = ({ match, history }) => {
    const flightId = match.params.flightId;


    const back = (e) => {
        e.stopPropagation()
        history.goBack()
    };

    return (
        <div className="static-modal">
            <Modal show={true} dialogClassName="custom-modal">

                <Modal.Body style={{ border: 'solid black 3px'}}>
                        <span id="closemodal" onClick={back} ><FontAwesome name='times' /></span>
                        <div>
                            <FlightModalDetail flightId={flightId}/>
                        </div>

                </Modal.Body>

            </Modal>

        </div>
    )

};

export default FlightModalDetailModal;