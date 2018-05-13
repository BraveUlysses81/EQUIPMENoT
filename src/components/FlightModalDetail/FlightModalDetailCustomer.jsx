import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import UserPhoto from '../../components/UserPhoto'
import FontAwesome from 'react-fontawesome'
import FlightModalDetailInstructor from './FlightModalDetailInstructor'
import FlightModalDetailInfo from './FlightModalDetailInfo'
import FlightModalDetailStatus from './FlightModalDetailStatus'
import CloseFlightUserPhoto from '../CloseFlight/CloseFlightUserPhoto'


class FlightModalDetailCustomer extends React.Component {
    state = {
    };

    constructor(){
        super()
    }

    static propTypes = {
        flight: PropTypes.object.isRequired,
        inFlight: PropTypes.func,
        completeFlight: PropTypes.func,
        dispatchFlight: PropTypes.func,
        getFlight: PropTypes.func,

    };

    numberCheck = (number) => {
        let digit = (number.length.toString()[0]);
        if (number.length === 11 && digit === "1")
        {
            return (number.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1-$2-$3-$4"))
        }
        else if (number.length === 10)
        {
            return (number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"))
        }
        else
        {
            return ("NUMBER IS INVALID")
        }
    };

    render() {

        return (
            <div id="flight-modal-detail-customer">

                <div id="dispatch-customer-header-left">
                    <div id="close-flight-customer-header-image">
                        <CloseFlightUserPhoto
                            picture_url={this.props.flight.customer_picture}
                            imageID="close-modal-customer-image"
                            thumbnailSize="user fa-5x"/>
                    </div>
                </div>

                <br/>
                    <div id="flight-modal-detail-customer-info-container">
                        <div id="dispatch-customer-info-header">
                            <h2 id="dispatch-customer-name">
                                {`${this.props.flight.customer_first} ${this.props.flight.customer_last}`}
                            </h2>

                            <br/>
                            <div id="dispatch-customer-mobile">
                                <FontAwesome name="mobile fa-2x" id="mobilePhone"/>
                                <div id="dispatch-customer-mobile-text">
                                    {this.numberCheck(`${this.props.flight.customer_mobile}`)}
                                </div>
                            </div>
                            <br/>
                            <div id="dispatch-customer-address">
                                <FontAwesome name="home fa-2x" id="homeIcon"/>
                                <div id="dispatch-customer-address-text">
                                    {`${this.props.flight.address + ', '}`}
                                    {`${this.props.flight.city + ' '}
                                ${this.props.flight.state}
                                ${this.props.flight.zip}`}
                                </div>
                            </div>
                        </div>
                    </div>
                <br/>

                <hr id="close-flight-hr"/>

                <div id="flight-modal-detail-instructor" className="row">
                    <FlightModalDetailInstructor flight={this.props.flight}/>
                </div>

                <br/>

                <div id="flight-modal-detail-info" className="row">
                    <FlightModalDetailInfo flight={this.props.flight}
                                           handleChange={this.props.handleChange}

                    />
                </div>

                <br/>

                <div id="flight-modal-detail-status" className="row">
                    <FlightModalDetailStatus flight={this.props.flight}
                                             inFlight={this.props.inFlight}
                                             completeFlight={this.props.completeFlight}
                                             dispatchFlight={this.props.dispatchFlight}
                                             handleChange={this.props.handleChange}
                                             ifrCheckout={this.state.ifrCheckout}
                                             getFlight={this.props.getFlight}
                                             handleTimesChange={this.props.handleTimesChange}

                    />

                </div>

            </div>

        )
    }
}



export default FlightModalDetailCustomer;