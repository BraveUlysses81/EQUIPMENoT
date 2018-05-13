import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import FlightModalDetailAircraft from './FlightModalDetailAircraft';
import './flightmodaldetail.css';
import FlightModalDetailCustomer from './FlightModalDetailCustomer';
import FlightModalDetailInstructor from './FlightModalDetailInstructor';
import FlightModalDetailStatus from './FlightModalDetailStatus';
import FlightModalDetailInfo from './FlightModalDetailInfo';
import dateFormat from 'dateformat'


class FlightModalDetailContainer extends React.Component {

    state = {
        flightType: "",
        crossCountry: false,
        flightReview: "",
        ifrCheckout: false,
        isFlightReview: false,
        end_hobbs: "",
        end_tach: "",

    };
    constructor(){
        super()
    }
    static propTypes = {
        flight: PropTypes.object.isRequired,
        getFlight: PropTypes.func,
        squawks: PropTypes.object,
    };

    dispatchFlight = (e) =>{
        if (this.props.flight.flight_status === "pinned" && this.props.flight.aircraft_status !== "active") {
            e.preventDefault();
            const currentDate = new Date(this.props.flight.currency_end_date);
            const endDate = new Date();

            axios.put(`http://localhost:3000/flight/release/${this.props.flight.flight_id}`, {
                dispatched_by: this.props.dispatcherId,
                flight_type: this.state.flightType || this.props.flight.flight_type,
                cross_country: this.state.crossCountry || this.props.flight.flight_type,
                dispatch_time: currentDate,
            })
                .then(function (response) {
                    console.log(response);
                })

                .catch(function (error) {
                    console.log(error);
                });

            if (this.props.flight.checkout_id === null && this.props.flight.flight_type === 'checkout' || this.props.flight.flight_type === 'flight_review') {
                let currencyDays = this.props.flight.currency_days * (1000 * 60 * 60 * 24);
                let currentDateDays = Math.round(new Date(new Date().getTime()));
                let checkoutExpDays = currentDateDays + currencyDays;
                let checkoutExpDate = dateFormat(checkoutExpDays, 'longDate');
                axios.post(`http://localhost:3000/checkout/newcheckout/${this.props.flight.customer_membership_id}`, {
                    currency_end_date: checkoutExpDate,
                    aircraft_id: this.props.flight.aircraft_id,
                    ifr_checkout: this.state.ifrCheckout,
                })
                    .then((response) => {
                        console.log(response)
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            }

            if (this.props.flight.checkout_id !== null) {
                let currencyDays = this.props.flight.currency_days * (1000 * 60 * 60 * 24);
                let currentDateDays = Math.round(new Date(new Date().getTime()));
                let checkoutExpDays = currentDateDays + currencyDays;
                let checkoutExpDate = dateFormat(checkoutExpDays, 'longDate');
                axios.put(`http://localhost:3000/checkout/${this.props.flight.customer_membership_id}/${this.props.flight.aircraft_id}`, {
                    currency_end_date: checkoutExpDate,
                    ifr_checkout: this.state.ifrCheckout,
                })
                    .then((response) => {
                        console.log(response)
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            }

            if (this.props.flight.flight_type === "flight_review") {
                axios.put(`http://localhost:3000/flightreview/${this.props.flight.customer_id}`, {
                    flight_review_date: currentDate
                })
                    .then((response) => {
                        console.log(response)
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            }
        } else {
            alert("Cannot dispatch active aircraft")
        }
        this.props.getFlight();
    };

    inFlight = (e) =>{
        e.preventDefault();
        axios.put(`http://localhost:3000/flight/inflight/${this.props.flight.flight_id}`, {
            beginning_tach: this.props.flight.beginning_tach,
            beginning_hobbs: this.props.flight.hobbs,
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        this.props.getFlight();
    };

    handleTimesChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value })
    }


    completeFlight = (e) =>{
        e.preventDefault();
        axios.put(`http://localhost:3000/flight/complete/${this.props.flight.flight_id}`, {
            end_hobbs: this.state.end_hobbs,
            end_tach: this.state.end_tach,
            aircraft_id: this.props.flight.aircraft_id,
            invoice_no: `${this.props.flight.flight_id}-${this.props.flight.aircraft_id}-${this.props.flight.customer_id}`


        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        this.props.getFlight();
    };

    handleChange = (event) => {
        if (event.target.name === 'checkout') {
            this.setState({flightType: 'checkout'})
        }
        if (event.target.name === 'ifr_checkout') {
            this.setState({ ifrCheckout: event.target.checked})
        }
        if (event.target.name === 'flight_review') {
            this.setState({
                flightType: 'flight_review',
            })
        }
        if (event.target.name === 'cross_country') {
            this.setState ({ crossCountry: event.target.checked})
        }
        if (event.target.name === 'solo') {
            this.setState({flightType: 'solo'})
        }
        if (event.target.name === 'renter') {
            this.setState({flightType: 'renter'})
        }
    };

    renderFlightModalDetailAircraft = (flight) => {
        this.setState({ flight: flight});
        this.setState({ canEditAircraftDetail: false })
    };

    render(){
        return(
            <div>
                <FlightModalDetailAircraft flight={this.props.flight}
                                           squawks={this.props.squawks}
                                           renderFlightModalDetailAircraft={this.renderFlightModalDetailAircraft}
                />

                <div id="dispatch-detail-container" className="col-sm-8">
                <FlightModalDetailCustomer flight={this.props.flight}
                                           inFlight={this.inFlight}
                                           completeFlight={this.completeFlight}
                                           dispatchFlight={this.dispatchFlight}
                                           handleChange={this.handleChange}
                                           ifrCheckout={this.state.ifrCheckout}
                                           getFlight={this.props.getFlight}
                                           handleTimesChange={this.handleTimesChange}
                />
                </div>

                {/*<div id="flight-modal-detail-instructor">*/}
                {/*<FlightModalDetailInstructor flight={this.props.flight}/>*/}
                {/*</div>*/}

                {/*<div className="row">*/}
                    {/*<FlightModalDetailInfo flight={this.props.flight}*/}
                                           {/*handleChange={this.props.handleChange}*/}

                    {/*/>*/}
                {/*</div>*/}

                {/*<div className="row">*/}
                    {/*<FlightModalDetailStatus flight={this.props.flight}*/}
                                             {/*inFlight={this.inFlight}*/}
                                             {/*completeFlight={this.completeFlight}*/}
                                             {/*dispatchFlight={this.dispatchFlight}*/}
                                             {/*handleChange={this.handleChange}*/}
                                             {/*ifrCheckout={this.state.ifrCheckout}*/}
                                             {/*getFlight={this.props.getFlight}*/}

                    {/*/>*/}

                {/*</div>*/}
            </div>
        )
    }
}

export default FlightModalDetailContainer;