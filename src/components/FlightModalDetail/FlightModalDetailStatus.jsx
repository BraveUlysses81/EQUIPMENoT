import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import {Button, ButtonToolbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import FontAwesome from 'react-fontawesome'


class FlightModalDetailStatus extends React.Component {

    state = {
        bsStyle: "primary",
    };
    constructor(props) {
        super(props)
    }

    static propTypes = {
        flight: PropTypes.object.isRequired,
        inFlight: PropTypes.func,
        completeFlight: PropTypes.func,
        dispatchFlight: PropTypes.func,
        getFlight: PropTypes.func,

    };

    flightPinned = () =>{
        if (this.props.flight.flight_status === "pinned"){
            // this.setState ({ bsStyle: "success" })

            return (
                <div>
                    <FontAwesome name="caret-down fa-2x" id="flight-modal-detail-pinned-caret"/>
                    <Button id="flight-modal-detail-active-btn">
                        DISPATCHED
                    </Button>
                </div>
            )
        } else {
            return (
                <div>
                    <Button id="flight-modal-detail-btn">
                        DISPATCH
                    </Button>
                </div>
            )
        }
    };

    flightDispatch = () =>{
        if (this.props.flight.flight_status === "dispatched"){
            // this.setState ({ bsStyle: "success" })

            return (
                <div>
                    <FontAwesome name="caret-down fa-2x" id="flight-modal-detail-dispatch-caret"/>
                    <Button id="flight-modal-detail-active-btn"
                            onClick={(e) => {this.props.dispatchFlight(e); this.props.getFlight()}}>
                        RELEASED
                    </Button>
                </div>
            )
        } else {
            return (
                <div>
                    <Button id="flight-modal-detail-btn"
                            onClick={(e) => {this.props.dispatchFlight(e); this.props.getFlight()}}>
                        RELEASE
                    </Button>
                </div>
            )
        }
    };

    flightInflight = () =>{
        if (this.props.flight.flight_status === "in_flight"){
            // this.setState ({ bsStyle: "success" })

            return (
                <div>
                    <FontAwesome name="caret-down fa-2x" id="flight-modal-detail-inflight-caret"/>
                    <Button id="flight-modal-detail-active-btn"
                            onClick={(e) => {this.props.inFlight(e); this.props.getFlight()}}>
                        IN FLIGHT
                    </Button>
                </div>
            )
        } else {
            return (
                <div>
                    <Button id="flight-modal-detail-btn"
                            onClick={(e) => {this.props.inFlight(e); this.props.getFlight()}}>
                        IN FLIGHT
                    </Button>
                </div>
            )
        }
    };

    flightComplete = () =>{
        if (this.props.flight.flight_status === "completed"){
            // this.setState ({ bsStyle: "success" })

            return (
                <div>
                    <Button id="flight-modal-detail-active-btn"
                            onClick={(e) => {this.props.completeFlight(e); this.props.getFlight()}}>
                        COMPLETED
                    </Button>
                </div>
            )
        } else {
            return (
                <div>
                    <Button id="flight-modal-detail-btn"
                            onClick={(e) => {this.props.completeFlight(e); this.props.getFlight()}}>
                        COMPLETE
                    </Button>
                </div>
            )
        }
    };

    flightClose = () =>{
        if (this.props.flight.flight_status === "closed"){
            // this.setState ({ bsStyle: "success" })

            return (
                <div>
                    <Link to={{
                        pathname: `/modal/flights/${this.props.flight.flight_id}`,
                        state: {modal: true}
                    } }>
                    <Button id="flight-modal-detail-active-btn"
                            onClick={(e) => {this.props.completeFlight(e); this.props.getFlight()}}>
                        CLOSED
                    </Button>
                    </Link>
                </div>
            )
        } else {
            return (
                <div>
                    <Link to={{
                        pathname: `/modal/flights/${this.props.flight.flight_id}`,
                        state: {modal: true}
                    } }>
                    <Button id="flight-modal-detail-btn"
                            onClick={(e) => {this.props.completeFlight(e); this.props.getFlight()}}>
                        CLOSE
                    </Button>
                    </Link>
                </div>
            )
        }
    };

    componentWillMount = () =>{
        this.flightPinned();
        this.flightDispatch();
        this.flightInflight();
        this.flightComplete();
        this.flightClose();
    };


    render(){
        return(
            <div id="flight-detail-modal-status-wrap">
                <div id="set-flight-status-container">
                    <span id="set-flight-status-text">SET FLIGHT STATUS</span>
                </div>
                <br/>
                <br/>
                <ButtonToolbar id="set-flight-status-button-toolbar">

                    {this.flightPinned()}

                    {
                        // this.props.flight.aircraft_status !== "active" &&
                        this.flightDispatch()
                    }

                    {this.flightInflight()}

                    {this.flightComplete()}

                    {/*{this.flightClose()}*/}

                </ButtonToolbar>
                { this.props.flight.flight_status === "in_flight" &&
                    (
                    <div id="manual-times-form" className="row">

                        <div className="col-sm-3">
                        <label>End Tach: </label>
                         <input type="text"
                                id="flight-modal-detail-status-end-tach"
                                name="end_tach"
                                onChange={this.props.handleTimesChange}
                                placeholder="Enter Tach"
                        />
                        </div>

                        <div className="col-sm-3">
                        <label>End Hobbs: </label>
                         <input type="text"
                                id="flight-modal-detail-status-end-hobbs"
                                name="end_hobbs"
                                onChange={this.props.handleTimesChange}
                                placeholder="Enter Hobbs"
                        />
                        </div>

                    </div>
                    )
                }

            </div>
        )
    }
}

export default FlightModalDetailStatus;