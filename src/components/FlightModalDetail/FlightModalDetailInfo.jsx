import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'

class FlightModalDetailInfo extends React.Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        flight: PropTypes.object.isRequired,

    };

    flightStatusCheck = (status) => {
        if (status === "pinned")
        {
            return ("DISPATCHED")
        }
        else if (status === "dispatched")
        {
            return ("RELEASED")
        }
        else if (status === "in_flight")
        {
            return ("IN FLIGHT")
        }
        else if (status === "completed")
        {
            return ("COMPLETED")
        }
        else
        {
            return ("CLOSED")
        }
    };

    render(){
        return(
            <div id="flight-detail-modal-info-status-container">
                    <div id="set-flight-status-container">
                        <span id="close-flight-instructor-text">
                            CURRENT FLIGHT STATUS:
                            <span id="flight-modal-detail-info-status">
                                {this.flightStatusCheck(this.props.flight.flight_status)}
                            </span>
                        </span>

                    </div>
                    {/*<span id="flight-modal-detail-info-status">{this.props.flight.flight_status}</span>*/}
                <br/>
                <br/>

                {
                    this.props.flight.flight_status === "pinned" &&
                    (
                    <div>
                        <div id="flight-modal-detail-info-container">

                            <div className="col-sm-4">
                                <input name="checkout"
                                       id="postflight-squawk-ground-flight-input"
                                       type="checkbox"
                                       onChange={this.props.handleChange}
                                />
                                <label id="flight-modal-detail-info-label">Aircraft Checkout
                                </label>
                            </div>

                            <div className="col-sm-4">
                                <input name="ifr_checkout"
                                       id="postflight-squawk-ground-flight-input"
                                       type="checkbox"
                                       onChange={this.props.handleChange}
                                />
                                <label id="flight-modal-detail-info-label">IFR Checkout
                                </label>
                            </div>

                            <div className="col-sm-4">
                                <input name="flight_review"
                                       id="postflight-squawk-ground-flight-input"
                                       type="checkbox"
                                       onChange={this.props.handleChange}
                                />
                                <label id="flight-modal-detail-info-label">Flight Review
                                </label>
                            </div>

                        </div>

                        <div id="dispatch-flight-info-subcontainer">

                            <div id="dispatch-flight-info-text" className="col-sm-4">
                                <input name="local-flight"
                                       id="postflight-squawk-ground-flight-input"
                                       type="checkbox"
                                       onChange={this.props.handleChange}
                                />
                                <label id="flight-modal-detail-info-label">Local Flight
                                </label>
                            </div>

                            <div id="dispatch-flight-info-text" className="col-sm-4">
                                <input name="cross_country"
                                       id="postflight-squawk-ground-flight-input"
                                       type="checkbox"
                                       onChange={this.props.handleChange}
                                />
                                <label id="flight-modal-detail-info-label">Cross Country
                                </label>
                            </div>

                            <div id="dispatch-flight-info-text" className="col-sm-4">
                                <input name="solo"
                                       id="postflight-squawk-ground-flight-input"
                                       type="checkbox"
                                       onChange={this.props.handleChange}
                                />
                                <label id="flight-modal-detail-info-label">Student Solo
                                </label>
                            </div>

                        </div>

                        <div id="dispatch-flight-info-subcontainer">

                            <div id="dispatch-flight-info-text" className="col-sm-4">
                                <input name="renter"
                                       id="postflight-squawk-ground-flight-input"
                                       type="checkbox"
                                       onChange={this.props.handleChange}
                                />
                                <label id="flight-modal-detail-info-label">Rental Flight
                                </label>
                            </div>
                        </div>

                    </div>
                    )
                }

            </div>

        )
    }

}

export default FlightModalDetailInfo;