import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import UserPhoto from '../UserPhoto'
import CloseFlightUserPhoto from './CloseFlightUserPhoto'

class CloseFlightCustomer extends React.Component {
    constructor() {
        super()
    }

    state = {
        canEditFlight: false
    };

    static propTypes = {
        flight: PropTypes.object.isRequired,
        back: PropTypes.func.isRequired
    };

    handleCancel = () => {
        this.props.back()
    };

    // isCheckout = () => {
    //
    // }


    render() {
        const customerImage = this.props.flight.customer_picture;
        const instructorImage = this.props.flight.instructor_picture;
        const flight = this.props.flight

        return (
            <div id="close-flight-customer">

                <div id="close-flight-customer-header-left">
                    <div id="close-flight-customer-header-image">
                        <CloseFlightUserPhoto
                            picture_url={customerImage}
                            imageID="close-modal-customer-image"
                            thumbnailSize="user fa-5x"/>
                    </div>

                </div>

                <div id="close-flight-customer-header-right">
                    <div id="close-flight-customer-name">

                        {`${flight.customer_first} `}
                        {flight.customer_last}

                    </div>
                    <br/>
                    <div id="close-flight-checkout-options">
                        <label id="close-flight-checkout-label">
                            <input
                                type="checkbox"
                                id="close-flight-checkout-input"
                                name="aircraftCheckout"
                                checked={flight.checkout_id}
                                onChange={(event) => this.handleCheckout(event)}
                                readOnly={!this.state.canEditFlight}/>
                            <div id="close-flight-checkout-text">Aircraft Checkout</div>
                        </label>
                        <br/>
                        <label id="close-flight-ifrcheckout-label">
                            <input
                                type="checkbox"
                                id="close-flight-ifrcheckout-input"
                                name="ifrCheckout"
                                checked={flight.flight_review_date}
                                onChange={(event) => this.handleCheckout(event)}
                                readOnly={!this.state.canEditFlight}/>
                            <div id="close-flight-ifrcheckout-text">IFR Checkout</div>
                        </label>
                        <br/>
                        <label id="close-flight-flightreview-label">
                            <input
                                type="checkbox"
                                id="close-flight-flightreview-input"
                                name="flightReview"
                                checked={flight.flight_review_date}
                                onChange={(event) => this.handleCheckout(event)}
                                readOnly={!this.state.canEditFlight}/>
                            <div id="close-flight-flightreview-text">Flight Review</div>
                        </label>
                    </div>
                </div>

                <br/>

                <hr id="close-flight-hr"/>

                <br/>

                <div id="close-flight-instructor">
                    <span id="close-flight-instructor-text">INSTRUCTOR</span>

                    <br/>

                    <div id="close-flight-instructor-container">
                    <div id="close-flight-instuctor-header-image">
                        <UserPhoto picture_url={instructorImage}  imageID="close-flight-instructor-image" thumbnailSize="user fa-3x"/>
                    </div>
                    <div id="close-flight-instructor-details">

                        <div id="flight-modal-detail-instructor-list-name" className="pull-left">
                            {`${flight.instructor_first} `}
                            {`${flight.instructor_last}`}
                        </div>
                    </div>
                        <br/>
                        <div id="close-flight-instructor-certs">
                        <div id="flight-modal-instructor-certs-top">
                            {this.props.flight.single_engine_instructor && `${this.props.flight.single_engine_instructor} `}
                            {this.props.flight.instrument_instructor && `${this.props.flight.instrument_instructor} `}
                            {this.props.flight.multi_engine_instructor && `${this.props.flight.multi_engine_instructor} `}
                            {this.props.flight.basic_ground_instructor && `${this.props.flight.basic_ground_instructor} `}
                        </div>
                        <br/>
                        <div id="close-flight-instructor-certs-bottom">
                            {this.props.flight.advanced_ground_instructor && `${this.props.flight.advanced_ground_instructor} `}
                            {this.props.flight.instrument_ground_instructor && `${this.props.flight.instrument_ground_instructor} `}
                            {this.props.flight.helicopter_instructor && `${this.props.flight.helicopter_instructor} `}
                            {this.props.flight.sport_pilot_instructor && `${this.props.flight.sport_pilot_instructor}`}
                        </div>
                        </div>

                        {/*<div id="close-flight-instructor-certs">*/}
                            {/*{`${flight.single_engine_instructor} `}*/}
                            {/*{`${flight.instrument_instructor} `}*/}
                            {/*{`${flight.multi_engine_instructor} `}*/}
                            {/*{`${flight.basic_ground_instructor} `}*/}
                            {/*{`${flight.advanced_ground_instructor} `}*/}
                            {/*{`${flight.instrument_ground_instructor} `}*/}
                            {/*{`${flight.helicopter_instructor} `}*/}
                            {/*{`${flight.sport_pilot_instructor} `}*/}
                        {/*</div>*/}
                        {/*<br/>*/}
                        {/*<div id="close-flight-instructor-name">*/}
                            {/*{`${flight.instructor_first} `}*/}
                            {/*{`${flight.instructor_last}`}*/}
                        {/*</div>*/}

                    </div>

                    <br/>

                    <div id="close-flight-instructor-billing">
                    <div id="close-flight-billing-ground-details">
                        <div id="close-flight-ground-hours">
                            GROUND HOURS
                            <br/>
                            <input
                                type="text"
                                name="editGround"
                                id="close-flight-edit-ground"
                                required placeholder={flight.billable_ground_hrs}
                            />
                        </div>
                    </div>
                    <div id="close-flight-billing-flight-details">
                        <div id="close-flight-flight-time">
                            FLIGHT TIME
                            <br/>
                            <input
                                type="text"
                                name="editFlight"
                                id="close-flight-edit-flight-time"
                                required placeholder={flight.end_hobbs}
                            />
                        </div>
                    </div>
                    <div id="close-flight-billing-rate-details">
                        <div id="close-flight-billing-rate">
                            RATE
                            <br/>
                            <input
                                type="text"
                                name="editRate"
                                id="close-flight-edit-rate"
                                required placeholder={flight.instruction_rate}
                            />
                        </div>
                    </div>
                    </div>
                </div>

                <br/>

                <div id="close-flight-aircraft-details">
                    <span id="close-flight-aircraft-text">AIRCRAFT</span>

                    <br/>

                    <div id="close-flight-hobbs-container">
                    <div id="close-flight-hobbs-text">
                        HOBBS
                    </div>
                    <div id="close-flight-start-hobbs-details">
                        <div id="close-flight-start-hobbs">
                            <div id="close-flight-start-hobbs-text">
                                START
                            </div>
                            <br/>
                            <input
                                type="text"
                                name="editStartHobbs"
                                id="close-flight-edit-start-hobbs"
                                required placeholder={flight.beginning_hobbs}
                            />
                        </div>
                    </div>
                    <div id="close-flight-end-hobbs-details">
                        <div id="close-flight-end-hobbs">
                            <div id="close-flight-end-hobbs-text">
                                END
                            </div>
                            <br/>
                            <input
                                type="text"
                                name="editEndHobbs"
                                id="close-flight-edit-end-hobbs"
                                required placeholder={flight.end_hobbs}
                            />
                        </div>
                    </div>
                    <div id="close-flight-hold-flight-details">
                        <div id="close-flight-hold-flight">
                            <div id="close-flight-hold-flight-time-text">
                                FLIGHT TIME
                            </div>
                            <br/>
                            <div id="close-flight-hold-flight-time">
                                <span>
                                {flight.end_hobbs}
                                </span>
                            </div>
                        </div>
                    </div>
                    </div>

                    <br/>

                    <div id="close-flight-tach-container">
                    <div id="close-flight-tach-text">
                        TACH
                    </div>
                    <div id="close-flight-start-hobbs-details">
                        <div id="close-flight-start-hobbs">
                            <div id="close-flight-start-hobbs-text">
                                START
                            </div>
                            <br/>
                            <input
                                type="text"
                                name="editStartHobbs"
                                id="close-flight-edit-start-hobbs"
                                required placeholder={flight.beginning_tach}
                            />
                        </div>
                    </div>
                    <div id="close-flight-end-hobbs-details">
                        <div id="close-flight-end-hobbs">
                            <div id="close-flight-end-hobbs-text">
                                END
                            </div>
                            <br/>
                            <input
                                type="text"
                                name="editEndHobbs"
                                id="close-flight-edit-end-hobbs"
                                required placeholder={flight.end_tach}
                            />
                        </div>
                    </div>
                    <div id="close-flight-hold-flight-details">
                        <div id="close-flight-hold-flight">
                            <div id="close-flight-hold-flight-time-text">
                                TIME REMAINING
                            </div>
                            <br/>
                            <div id="close-flight-hold-flight-time">
                                <span>
                                {flight.end_tach}
                                </span>
                            </div>
                        </div>
                    </div>
                    </div>

                </div>


                <br/>

                <div id="close-flight-button-group">
                    <button type="submit"
                            className="btn btn-default"
                            id="cancel-close-flight-btn"
                            onClick={this.handleCancel}
                    >
                        CANCEL
                    </button>
                    <button type="submit"
                            className="btn btn-default"
                            id="close-flight-btn"
                            // onClick={this.closeFlight}
                    >
                        CLOSE FLIGHT
                    </button>
                </div>

            </div>
        )
    }
}

export default CloseFlightCustomer