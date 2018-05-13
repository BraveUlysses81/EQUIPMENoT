import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import DispatchFlightType from './DispatchFlightType'
import { postFlight } from '../../actions/dispatchActions'
import { connect } from 'react-redux'
import dateFormat from 'dateformat'
import axios from 'axios'
import { server } from '../../helpers/serverAddress'


class DispatchFlightInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        flightId: "",
        flightType: "",
        crossCountry: false,
        flightReview: "",
        ifrCheckout: false,
        isFlightReview: false,
    };

    static propTypes = {
        selectedDispatchCustomer: PropTypes.object,
        selectedDispatchAircraft: PropTypes.object,
        selectedDispatchInstructor: PropTypes.object,
        dispatcherId: PropTypes.number,
        hasCheckout: PropTypes.bool,
        hasExpiredCheckout: PropTypes.bool,
        override: PropTypes.bool,
        postFlight: PropTypes.func.isRequired,
        hasCert: PropTypes.bool,
        hasHighPerformance: PropTypes.bool,
        hasComplex: PropTypes.bool,
        hasTailwheel: PropTypes.bool,
        dispatchInstructorIsSelected: PropTypes.bool,
        hasAgreement: PropTypes.bool,
        hasDocuments: PropTypes.bool,
        hasMedical: PropTypes.bool,
        hasStudentSolo: PropTypes.bool,
        hasFlightReview: PropTypes.bool,
        hasFlights: PropTypes.bool,
        introFlight: PropTypes.bool,
        trainingFlight: PropTypes.bool,
        rentalFlight: PropTypes.bool,
        studentSoloFlight: PropTypes.bool,
        checkrideFlight: PropTypes.bool,
        checkoutFlight: PropTypes.bool,
        flightReviewFlight: PropTypes.bool,
    };

    componentWillMount(){
        this.props.flightChecks();
        this.setFlightType(this.props)
    }

    componentWillReceiveProps(nextProps){
        this.props.flightChecks();
        this.setFlightType(nextProps)
    }

    setFlightType = (props) => {
        if(props.introFlight) {
            this.setState({ flightType: "intro_flight" })
        }
        if(props.trainingFlight) {
            this.setState({ flightType: "training_flight" })
        }
        if(props.rentalFlight) {
            this.setState({ flightType: "renter" })
        }
        if(props.studentSoloFlight) {
            this.setState({ flightType: "solo" })
        }
        if(props.checkoutFlight) {
            this.setState({ flightType: "checkout" })
        }
        if(props.checkrideFlight) {
            this.setState({ flightType: "checkride" })
        }
        if(props.flightReviewFlight) {
            this.setState({ flightType: "flight_review" })
        }
        if(props.overrideFlight) {
            this.setState({ flightType: "override" })
        }
        if(!props.overrideFlight && !props.flightReviewFlight && !props.checkrideFlight && !props.checkoutFlight && !props.studentSoloFlight && !props.rentalFlight && !props.trainingFlight && !props.introFlight){
            this.setState({ flightType: "" })
        }
    };

    pinNewFlight = (e) =>{
        e.preventDefault();
        this.props.postFlight(this.props.selectedDispatchAircraft, this.props.selectedDispatchCustomer, this.props.selectedDispatchInstructor, this.state)
            .then( (response) => {
                const flightId = response.data[0].flight_id;
                    this.setState({flightId: flightId})
                })
            .catch(function (error) {
                console.log(error);
            })
    };

    dispatchThisFlight = (e) =>{
        e.preventDefault();
        axios.put(`${server}/flight/release/${this.state.flightId}`, {
            dispatched_by: this.props.dispatcherId,
            flight_type: this.state.flightType,
            cross_country: this.state.crossCountry,
        })
            .then(function (response) {
                console.log(response);
            })

            .catch(function (error) {
                console.log(error);
            });
        if (!this.props.hasCheckout && !this.props.hasExpiredCheckout && this.state.flightType === 'checkout' || this.props.override){
            let currencyDays = this.props.selectedDispatchAircraft.currency_days  * (1000 * 60 * 60 * 24);
            let currentDateDays = Math.round(new Date(new Date().getTime()));
            let checkoutExpDays = currentDateDays + currencyDays;
            let checkoutExpDate = dateFormat(checkoutExpDays, 'longDate');
            axios.post(`${server}/checkout/newcheckout/${this.props.selectedDispatchCustomer.membership_id}`, {
                currency_end_date: checkoutExpDate,
                aircraft_id: this.props.selectedDispatchAircraft.aircraft_id,
                ifr_checkout: this.state.ifrCheckout,
            })
                .then( (response) => {
                    console.log(response)
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        if(this.props.hasCheckout || (this.props.hasExpiredCheckout && this.state.flightType === "checkout")){
            let currencyDays = this.props.selectedDispatchAircraft.currency_days  * (1000 * 60 * 60 * 24);
            let currentDateDays = Math.round(new Date(new Date().getTime()));
            let checkoutExpDays = currentDateDays + currencyDays;
            let checkoutExpDate = dateFormat(checkoutExpDays, 'longDate');
            axios.put(`${server}/checkout/${this.props.selectedDispatchCustomer.membership_id}/${this.props.selectedDispatchAircraft.aircraft_id}`, {
                currency_end_date: checkoutExpDate,
                ifr_checkout: this.state.ifrCheckout,
            })
                .then( (response) => {
                    console.log(response)
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        if(this.state.isFlightReview === true){
            axios.put(`${server}/flightreview/${this.props.selectedDispatchCustomer.person_id}`, {
                flight_review_date: this.state.flightReview
            })
                .then( (response) => {
                    console.log(response)
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        this.props.back();

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
                flightReview: new Date(),
                isFlightReview: true,
                flightType: 'flight_review',
            })
        }
        if (event.target.name === 'cross_country') {
            this.setState ({ crossCountry: event.target.checked})
        }
        if (event.target.name === 'solo') {
            this.setState({flightType: 'solo'})
        }
        if (event.target.name === 'checkride') {
            this.setState({flightType: 'checkride'})
        }
    };

    render() {
        return (
            <div id="dispatch-flight-info">
                {(this.props.hasAgreement || this.props.override) &&
                    <div className="row" id="instructor-flight">

                        <h4 id="dispatch-flight-info-head">This flight is a</h4>
                        <br/>

                        <DispatchFlightType
                            handleChange={this.handleChange}
                            hasCheckout={this.props.hasCheckout}
                            override={this.props.override}
                            dual_only={this.props.selectedDispatchAircraft.dual_only}
                            hasCert={this.props.hasCert}
                            hasStudentSolo={this.props.hasStudentSolo}
                            introFlight={this.props.introFlight}
                            trainingFlight={this.props.trainingFlight}
                            rentalFlight={this.props.rentalFlight}
                            studentSoloFlight={this.props.studentSoloFlight}
                            checkrideFlight={this.props.checkrideFlight}
                            checkoutFlight={this.props.checkoutFlight}
                            flightReviewFlight={this.props.flightReviewFlight}
                        />

                        <div id="dispatch-flight-flight-buttons" className="pull-right">
                            {((this.props.dual_only && this.props.dispatchInstructorIsSelected) || !this.props.dual_only) &&


                            <button id="pin-flight-btn"
                                    className="btn btn-default"
                                    onClick={(e) => this.pinNewFlight(e)}
                            >DISPATCH</button>

                            }

                            {this.props.selectedDispatchAircraft.aircraft_status === 'flight_line' && ((this.props.dual_only && this.props.dispatchInstructorIsSelected) || !this.props.dual_only) &&

                            <button id="dispatch-flight-btn"
                                    className="btn btn-default"
                                    onClick={(e) => this.dispatchThisFlight(e)}
                            >DISPATCH AND RELEASE</button>
                            }

                        </div>

                    </div>
                }
                {(!this.props.hasAgreement && !this.props.override) &&
                    <div>
                        <h1>NO RENTAL AGREEMENT ON FILE</h1>
                    </div>
                }
            </div>
        )
    }

}

export default connect(null, { postFlight })(DispatchFlightInfo);