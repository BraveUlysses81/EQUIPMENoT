import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import DispatchCustomerList from './DispatchCustomerList'
import DispatchContainer from './DispatchContainer'
import axios from 'axios'
import './dispatch.css'
import { connect } from 'react-redux'
import { server } from '../../helpers/serverAddress'


class FlightDispatch extends React.Component {
    state = {
        checkouts: {},
        pilotDocuments: {},
        dispatchCustomers: {},
        pilotCerts: {},
        dispatchCustomerIsSelected: false,
        selectedDispatchCustomer: {},
        override: false,
        hasDocuments: false,
        hasMedical: false,
        hasAgreement: false,
        hasFlights: false,
        studentSolo: {},
        hasFlightReview: false,
    };

    constructor(props) {
        super(props);
        const clearState = this.state
    }

    static propTypes = {
        dispatcherId: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        schoolId: PropTypes.string.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedDispatchCustomer !== this.state.selectedDispatchCustomer){
            let nextSelectedDispatchCustomer = nextProps.selectedDispatchCustomer;
            this.getCheckouts(nextSelectedDispatchCustomer);
            this.getStudentSolo(nextSelectedDispatchCustomer);
            this.getPilotCertificate(nextSelectedDispatchCustomer);
        }
    }

    getDispatchCustomers = () => {
        axios.get(`${server}/customers/all/${this.props.schoolId}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }})
            .then( (data) => {
                //map through the data array and send each result to addCustomer
                data.data.map((i) => {
                    //update with current state
                    const dispatchCustomers = {...this.state.dispatchCustomers};
                    //index customer and add to the customers array
                    dispatchCustomers[`dispatchCustomer-${i.person_id}`] = i;
                    //set state
                    this.setState({dispatchCustomers})
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    selectDispatchCustomer = (selectedDispatchCustomer) => {
        axios.get(`${server}/flight/all/${selectedDispatchCustomer.person_id}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }})
            .then((data) => {
                let flights = data.data.length;
                if (flights > 0) {
                    this.setState({ hasFlights: true})
                }
            })
            .catch(function (error) {
                console.log(error)
            });
        // set customerIsSelected to true so CustomerDetailContainer is rendered and reset canEditCustomerDetail
        this.setState
        ({
            selectedDispatchCustomer: selectedDispatchCustomer,
            dispatchCustomerIsSelected: true,
            memberType: selectedDispatchCustomer.membership_type
        });
        this.getCheckouts(selectedDispatchCustomer);
        this.getPilotCertificate(selectedDispatchCustomer);
        this.getStudentSolo(selectedDispatchCustomer);
    };

    getCheckouts = (selectedDispatchCustomer) => {
        // Reset checkout & pilot Documents
        this.setState({checkouts: {}, pilotDocuments: {} })
        // API call to get checkouts
        axios.all([
            axios.get(`${server}/membership/checkouts/${selectedDispatchCustomer.membership_id}`),
            axios.get(`${server}/membership/documents/${selectedDispatchCustomer.person_id}`)
        ], { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }})
            .then(axios.spread((checkouts, pilotDocuments) => {
                checkouts.data.map((i) =>{
                    const checkouts = {...this.state.checkouts}; //create a copy of the checkout state
                    checkouts[`checkout-${i.checkout_id}`] = i; // add the checkout to the checkout copy
                    this.setState({ checkouts }) //call set state with the updated copy
                });
                pilotDocuments.data.map((i) =>{
                    const pilotDocuments = {...this.state.pilotDocuments} //create a copy of the checkout state
                    pilotDocuments[`membership-${i.person_id}`] = i // add the checkout to the checkout copy
                    this.setState({ pilotDocuments }) //call set state with the updated copy
                });
                const currentDate = new Date();

                const hasAgreement = Object.keys(this.state.pilotDocuments).some((key) => {
                    let document = this.state.pilotDocuments[key];
                    return document.rental_agreement;

                });
                const hasFlightReview = Object.keys(this.state.pilotDocuments).some((key) => {
                    let document = this.state.pilotDocuments[key];
                    let flightReviewDays =  (Math.round(new Date(document.flight_review_date))) / (1000 * 60 * 60 * 24);
                    let currentDateDays = (Math.round(currentDate)) / (1000 * 60 * 60 * 24);
                    if ((flightReviewDays + 730) > currentDateDays){
                        return true
                    }
                });
                const hasDocuments = Object.keys(this.state.pilotDocuments).some((key) => {
                    let document = this.state.pilotDocuments[key];
                    const faaTestExp = new Date(document.faa_written_test_exp);
                    if((document.tsa_endorsement === true && document.background_check === true &&
                        (document.photo_id === true || document.passport === true))){
                        return true
                    }
                    if (faaTestExp > currentDate) {
                        return true
                    }
                });
                const hasMedical = Object.keys(this.state.pilotDocuments).some((key) => {
                    let document = this.state.pilotDocuments[key];
                    const medDate = new Date(document.medical_date);
                    let medicalDateDays =  (Math.round(new Date(medDate))) / (1000 * 60 * 60 * 24);
                    let currentDateDays = (Math.round(currentDate)) / (1000 * 60 * 60 * 24);

                    if (document.medical_class === 'one' && ((currentDateDays - medicalDateDays) < 181)) {
                        return true;
                    } else if
                    (document.medical_class === 'two' && ((currentDateDays - medicalDateDays) < 366)) {
                        return true
                    } else if
                    (document.medical_class === 'three' && ((currentDateDays - medicalDateDays) < 731)) {
                        return true
                    }
                });
                this.setState({
                    hasDocuments,
                    hasMedical,
                    hasAgreement,
                    hasFlightReview,
                })
            }))
            .catch(function (error) {
                console.log(error)
            })
    };

    getStudentSolo = (selectedDispatchCustomer) =>{
        this.setState({ studentSolo: {} });
        axios.get(`${server}/member/${selectedDispatchCustomer.membership_id}/studentendorsements`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
            .then((data) => {
                data.data.map((i) => {
                    const studentSolo = {...this.state.studentSolo};
                    studentSolo[`studentSolo-${i.student_endorsement_id}`] = i;
                    this.setState({ studentSolo: studentSolo})
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    getPilotCertificate = (selectedDispatchCustomer) => {
        this.setState({pilotCerts: {}});
        axios.get(`${server}/pilot/${selectedDispatchCustomer.person_id}/pilot_certificate`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                }
            })
            .then((data) => {
                data.data.map((i) => {
                    const pilotCerts = {...this.state.pilotCerts};
                    pilotCerts[`pilotCerts-${i.pilot_certificate_id}`] = i;
                    this.setState({
                        pilotCerts: pilotCerts
                    })

                })
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    componentWillMount = () => {
        this.getDispatchCustomers();
    };

    flightOverride = () =>{
        this.setState ({ override: true })
    };

    render() {
        return (
            <div>
                <DispatchCustomerList dispatchCustomers={this.state.dispatchCustomers}
                                      selectDispatchCustomer={ this.selectDispatchCustomer}
                />
                {
                    this.state.dispatchCustomerIsSelected &&
                    <DispatchContainer
                        selectedDispatchCustomer={this.state.selectedDispatchCustomer}
                        schoolId={this.props.schoolId}
                        dispatcherId={this.props.dispatcherId}
                        checkouts={this.state.checkouts}
                        pilotCerts={this.state.pilotCerts}
                        flightOverride={this.flightOverride}
                        override={this.state.override}
                        back={this.props.back}
                        pilotDocuments={this.state.pilotDocuments}
                        hasDocuments={this.state.hasDocuments}
                        hasMedical={this.state.hasMedical}
                        hasAgreement={this.state.hasAgreement}
                        hasFlights={this.state.hasFlights}
                        studentSolo={this.state.studentSolo}
                        hasFlightReview={this.state.hasFlightReview}
                    />
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        dispatcherId: state.user.person_id
    }
};

export default connect(mapStateToProps)(FlightDispatch);