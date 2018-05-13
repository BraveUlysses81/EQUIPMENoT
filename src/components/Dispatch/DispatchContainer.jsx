import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import DispatchAircraftList from "./DispatchAircraftList"
import DispatchInstructorList from './DispatchInstructorList'
import DispatchCustomerDetail from './DispatchCustomerDetail'
import DispatchFlightInfo from './DispatchFlightInfo'
import { connect } from 'react-redux'
import { getAircraft, getInstructors } from '../../actions/dispatchActions'


class DispatchContainer extends React.Component {
    state = {
        pilotDocuments: '',
        dispatchAircrafts: {},
        dispatchInstructors: {},
        selectedDispatchAircraft: {},
        selectedDispatchInstructor: {},
        dispatchInstructorIsSelected: false,
        dispatchAircraftIsSelected: false,
        hasCheckout: false,
        hasExpiredCheckout: false,
        hasCert: false,
        hasHighPerformance: false,
        hasComplex: false,
        hasTailwheel: false,
        hasStudentSolo: false,
        introFlight: false,
        trainingFlight: false,
        rentalFlight: false,
        studentSoloFlight: false,
        checkrideFlight: false,
        checkoutFlight: false,
        flightReviewFlight: false,
        overrideFlight: false,
    };

    constructor(){
        super()

    }

    static propTypes = {
        selectedDispatchCustomer: PropTypes.object.isRequired,
        schoolId: PropTypes.string.isRequired,
        dispatcherId: PropTypes.number.isRequired,
        checkouts: PropTypes.object,
        flightOverride: PropTypes.func,
        getAircraft: PropTypes.func.isRequired,
        getInstructors: PropTypes.func.isRequired,
        override: PropTypes.bool,
        pilotCerts: PropTypes.object,
        pilotDocuments: PropTypes.object,
        studentSolo: PropTypes.object,
        hasFlights: PropTypes.bool,
    };

    componentWillMount() {
        this.getDispatchAircraft();
        this.getDispatchInstructors()
    }

    componentWillReceiveProps(){
        this.getDispatchAircraft();
        this.getDispatchInstructors();
        this.resetState();
    }

    resetState = () =>{
        this.setState({
            selectedDispatchAircraft: {},
            selectedDispatchInstructor: {},
            dispatchInstructorIsSelected: false,
            dispatchAircraftIsSelected: false,
            hasCheckout: false,
            hasExpiredCheckout: false,
            hasCert: false,
            hasHighPerformance: false,
            hasComplex: false,
            hasTailwheel: false,
            hasStudentSolo: false,
            introFlight: false,
            trainingFlight: false,
            rentalFlight: false,
            studentSoloFlight: false,
            checkrideFlight: false,
            checkoutFlight: false,
            flightReviewFlight: false,
            });
        this.resetButtonStyle();
        this.resetInstructorButtonStyle();
    };

    getDispatchAircraft = () => {
        this.props.getAircraft(this.props.schoolId)
            .then( (data) => {
                //map through the data array and send each result to addCustomer
                data.data.map((i) => {
                    //update with current state
                    const dispatchAircrafts = {...this.state.dispatchAircrafts};
                    //index customer and add to the customers array
                    dispatchAircrafts[`dispatchAircraft-${i.aircraft_id}`] = i;
                    //set state
                    this.setState({dispatchAircrafts})
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    getDispatchInstructors = () => {
        this.props.getInstructors(this.props.schoolId)
            .then( (data) => {
                //map through the data array and send each result to addCustomer
                data.data.map((i) => {
                    //update with current state
                    const dispatchInstructors = {...this.state.dispatchInstructors};
                    //index customer and add to the customers array
                    dispatchInstructors[`dispatchInstructor-${i.person_id}`] = i;
                    //set state
                    this.setState({dispatchInstructors})
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    resetButtonStyle = () => {
        const { selectedDispatchAircraft } = this.state;
        const { dispatchAircrafts } = this.state;

        if(selectedDispatchAircraft) {
            Object.keys(dispatchAircrafts).map(key => {
                dispatchAircrafts[key].buttonSelectedClass = 'dispatch-button';
                this.setState({ dispatchAircrafts })
            })
        }
    };

    resetInstructorButtonStyle = () => {
        const { selectedDispatchInstructor } = this.state;
        const { dispatchInstructors } = this.state;

        if(selectedDispatchInstructor) {
            Object.keys(dispatchInstructors).map(key => {
                dispatchInstructors[key].buttonSelectedClass = 'dispatch-button';
                this.setState({ dispatchInstructors })
            })
        }
    };

    selectDispatchInstructor = (selectedDispatchInstructor) => {
        //reset previous selected Dispacth instructor button styling
        this.resetInstructorButtonStyle();

        // set customerIsSelected to true so CustomerDetailContainer is rendered and reset canEditCustomerDetail
        this.setState({ selectedDispatchInstructor: selectedDispatchInstructor, dispatchInstructorIsSelected: true})

        //set button styling for selectedInstructor
        selectedDispatchInstructor.buttonSelectedClass = 'dispatch-button-selected';

        this.flightChecks();
    };

    selectDispatchAircraft = (selectedDispatchAircraft) => {
        //reset previous selected Dispact aircraft button styling
        this.resetButtonStyle();

        //check if selected aircraft has checkout
        const { checkouts } = this.props;
        const currentDate = new Date();   // get current date
        const { pilotCerts } = this.props;
        const hasCheckout = Object.keys(checkouts).some((key) => {
            const endDate = new Date(checkouts[key].currency_end_date);
            return checkouts[key].aircraft_id === selectedDispatchAircraft.aircraft_id && endDate >= currentDate
        });
        const hasExpiredCheckout = Object.keys(checkouts).some((key) => {
            const endDate = new Date(checkouts[key].currency_end_date);
            return checkouts[key].aircraft_id === selectedDispatchAircraft.aircraft_id && endDate < currentDate
        });
        const { studentSolo } = this.props;
        const hasStudentSolo = Object.keys(studentSolo).some((key) => {
            return studentSolo[key].aircraft_id === selectedDispatchAircraft.aircraft_id;
        });
        const hasCert = Object.keys(pilotCerts).some((key) => {
            let pilotCert = pilotCerts[key];
            if (pilotCert.category === selectedDispatchAircraft.category && pilotCert.class === selectedDispatchAircraft.class){
                return true
            }
        });
        const hasHighPerformance =Object.keys(pilotCerts).some((key) => {
            let pilotCert = pilotCerts[key];

            if (selectedDispatchAircraft.engine === "High Performance Piston" || selectedDispatchAircraft.engine === "High Performance Radial") {
                return pilotCert.high_performance;
            } else {
                return true
            }
        });
        const hasComplex =Object.keys(pilotCerts).some((key) => {
            let pilotCert = pilotCerts[key];

            if (selectedDispatchAircraft.complex === true) {
                return pilotCert.complex;
            } else {
                return true
            }
        });
        const hasTailwheel =Object.keys(pilotCerts).some((key) => {
            let pilotCert = pilotCerts[key];

            if (selectedDispatchAircraft.tailwheel === true) {
                return pilotCert.tailwheel;
            } else {
                return true
            }
        });

        this.setState({
            hasCheckout,
            hasExpiredCheckout,
            hasCert,
            hasHighPerformance,
            hasStudentSolo,
            hasComplex,
            hasTailwheel,
        });
        //set button styling for selectedAircraft
        selectedDispatchAircraft.buttonSelectedClass = 'dispatch-button-selected';
        // set customerIsSelected to true so CustomerDetailContainer is rendered and reset canEditCustomerDetail
        this.setState({ selectedDispatchAircraft: selectedDispatchAircraft, dispatchAircraftIsSelected: true})

        this.flightChecks();
    };

    flightChecks = () => {
        const introFlight = !this.props.hasFlights && this.state.dispatchInstructorIsSelected;
        const trainingFlight = this.props.hasFlights && !this.state.hasStudentSolo && !this.state.hasCert && this.state.dispatchInstructorIsSelected;
        const rentalFlight = (
            this.props.hasDocuments && this.props.hasMedical
            && this.state.hasCheckout && this.state.hasCert
            && this.state.hasHighPerformance && this.state.hasComplex
            && this.state.hasTailwheel && this.props.hasFlightReview
        );
        const studentSoloFlight = (
            this.state.hasStudentSolo && this.state.hasCert
            && this.props.hasDocuments && this.props.hasMedical
        );
        const checkrideFlight = (
            studentSoloFlight && this.state.dispatchInstructorIsSelected
        );
        const checkoutFlight = (
            this.props.hasDocuments && this.props.hasMedical
            && (!this.state.hasCheckout || this.state.hasExpiredCheckout) && this.state.hasCert
            && this.state.hasHighPerformance && this.state.hasComplex
            && this.state.hasTailwheel && this.props.hasFlightReview
            && this.state.dispatchInstructorIsSelected
        );
        const flightReviewFlight = (
            this.props.hasDocuments && this.props.hasMedical
            && this.state.hasCheckout && this.state.hasCert
            && this.state.hasHighPerformance && this.state.hasComplex
            && this.state.hasTailwheel && this.props.hasFlightReview
            && this.state.dispatchInstructorIsSelected
        );
        const overrideFlight = (
            this.props.override
        );
        this.setState({
            introFlight,
            trainingFlight,
            rentalFlight,
            studentSoloFlight,
            checkrideFlight,
            checkoutFlight,
            flightReviewFlight,
            overrideFlight,
        })
    };

    render() {
        return (
            <div id="dispatch-detail-container" className="col-sm-8">
                <DispatchCustomerDetail
                    selectedDispatchCustomer={this.props.selectedDispatchCustomer}
                    flightOverride={this.props.flightOverride}
                    resetState={this.resetState}
                />

                <DispatchAircraftList dispatchAircrafts={this.state.dispatchAircrafts}
                                      selectDispatchAircraft={this.selectDispatchAircraft}
                                      selectedDispatchAircraft={this.state.selectedDispatchAircraft}
                />

                <DispatchInstructorList dispatchInstructors={this.state.dispatchInstructors}
                                        selectDispatchInstructor={this.selectDispatchInstructor}
                                        selectedDispatchInstructor={this.state.selectedDispatchInstructor}
                                        hasCheckout={this.state.hasCheckout}

                />

                <DispatchFlightInfo selectedDispatchCustomer={this.props.selectedDispatchCustomer}
                                    selectedDispatchAircraft={this.state.selectedDispatchAircraft}
                                    selectedDispatchInstructor={this.state.selectedDispatchInstructor}
                                    dispatcherId={this.props.dispatcherId}
                                    checkouts={this.props.checkouts}
                                    override={this.props.override}
                                    back={this.props.back}
                                    studentSolo={this.props.studentSolo}
                                    dispatchInstructorIsSelected={this.state.dispatchInstructorIsSelected}

                                    hasCheckout={this.state.hasCheckout}
                                    hasExpiredCheckout={this.state.hasExpiredCheckout}
                                    hasDocuments={this.props.hasDocuments}
                                    hasMedical={this.props.hasMedical}
                                    hasAgreement={this.props.hasAgreement}
                                    hasFlights={this.props.hasFlights}
                                    hasStudentSolo={this.state.hasStudentSolo}
                                    hasCert={this.state.hasCert}
                                    hasHighPerformance={this.state.hasHighPerformance}
                                    hasComplex={this.state.hasComplex}
                                    hasTailwheel={this.state.hasTailwheel}
                                    hasFlightReview={this.props.hasFlightReview}

                                    introFlight={this.state.introFlight}
                                    trainingFlight={this.state.trainingFlight}
                                    rentalFlight={this.state.rentalFlight}
                                    studentSoloFlight={this.state.studentSoloFlight}
                                    checkrideFlight={this.state.checkrideFlight}
                                    checkoutFlight={this.state.checkoutFlight}
                                    flightReviewFlight={this.state.flightReviewFlight}
                                    overrideFlight={this.state.overrideFlight}

                                    flightChecks={this.flightChecks}
                />
            </div>
        )
    }
}

export default connect(null, { getAircraft, getInstructors })(DispatchContainer);