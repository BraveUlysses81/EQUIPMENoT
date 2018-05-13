
import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import dateFormat from 'dateformat'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { server } from '../../helpers/serverAddress'
import InstructorCurrency from './InstructorCurrency'
import InstructorDocuments from './InstructorDocuments'
import InstructorCerts from './InstructorCerts'


class InstructorDetailContact extends React.Component  {

    //set initial state
    state = {

        errors: '',
        checkout: '',
        instructorDocuments: ''

        // selectedInstructor: {
        //     mobile: '',
        //     phone: '',
        //     address: '',
        //     city: '',
        //     state: '',
        //     zip: '',
        //     emergency_first_name: '',
        //     emergency_last_name: '',
        //     emergency_phone: '',
        //     dob: ''
        // },
        // checkout: '',
        // documents: ''
    };

    constructor(){
        super()
    }

    static propTypes = {
        canEditInstructorDetail: PropTypes.bool.isRequired,
        selectedInstructor: PropTypes.object.isRequired
    };

    componentWillMount() {
        // this.setState({selectedInstructor: this.validateInputs(this.props.selectedInstructor) });
        this.getCheckouts(this.props.selectedInstructor)
    }

    componentWillReceiveProps(nextProps) {
        // Check if selectedInstructor has changed and then update state
        if (nextProps.selectedInstructor !== this.state.selectedInstructor) {
            let nextSelectedInstructor = nextProps.selectedInstructor;

            //update checkouts
            this.getCheckouts(nextSelectedInstructor)

            // this.setState({ selectedInstructor: this.validateInputs(nextSelectedInstructor) })
        }
    }

    getCheckouts = (selectedInstructor) => {
        // Reset checkout & pilot Documents
        this.setState({checkout: [], instructorDocuments: []});
        // API call to get checkouts
        axios.all([
            axios.get(`${server}/membership/checkouts/${selectedInstructor.membership_id}`),
            axios.get(`${server}/membership/documents/${selectedInstructor.person_id}`)
            ], { headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }})
            .then(axios.spread((checkouts, instructorDocuments) => {
                checkouts.data.map((i) => {
                    const checkout = {...this.state.checkout}; //create a copy of the checkout state
                    checkout[`checkout-${i.checkout_id}`] = i; // add the checkout to the checkout copy
                    this.setState({ checkout }) //call set state with the updated copy
                });
                instructorDocuments.data.map((i) => {
                    const instructorDocuments = {...this.state.instructorDocuments}; //create a copy of the checkout state
                    instructorDocuments[`membership-${i.person_id}`] = i; // add the checkout to the checkout copy
                    this.setState({ instructorDocuments }) //call set state with the updated copy
                })
            }))
            .catch(function (error) {
                console.log(error)
            })
    };

        // API call to get pilot documents
    //     axios.get('http://localhost:3000/instructor/' + selectedInstructor.person_id + '/documents',
    //         { headers: {
    //             Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
    //         }})
    //         .then((data) => {
    //             data.data.map((i) =>{
    //                 const documents = {...this.state.documents}
    //                 documents[`documents-${i.document_id}`] = i
    //                 this.setState({ documents })
    //             })
    //         })
    //         .catch(function (error) {
    //             console.log(error)
    //         })
    // };

    phoneNumberFormat = (number) => {
        if(number){
            let digit = (number.length.toString()[0]);
            if (number.length == 11 && digit === "1")
            {
                return (number.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1-$2-$3-$4"))
            }
            else if (number.length == 10)
            {
                return (number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"))
            }
            else
            {
                return number
            }
        } else {
            return ('')
        }
    };

    formatDates = (date) => {
        if(date){
            return (dateFormat(date, 'mediumDate'))
        } else {
            return('')
        }
    };

    isvalid = () => {
        const { errors, isValid } = validateInput(this.state);

        if(!isValid) {
            this.setState({ errors })
        }
        return isValid
    };

    // validateInputs = (selectedInstructor) => {
    //
    //     if (selectedInstructor.mobile == null){
    //         selectedInstructor.mobile = ''
    //     } else {
    //         selectedInstructor.mobile = selectedInstructor.mobile.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1-$2-$3-$4")
    //     }
    //     if (selectedInstructor.phone == null){
    //         selectedInstructor.phone = ''
    //     } else {
    //         selectedInstructor.phone = selectedInstructor.phone.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1-$2-$3-$4")
    //     }
    //     if (selectedInstructor.address == null){
    //         selectedInstructor.address = ''
    //     }
    //     if (selectedInstructor.city == null){
    //         selectedInstructor.city = ''
    //     }
    //     if (selectedInstructor.state == null){
    //         selectedInstructor.state = ''
    //     }
    //     if (selectedInstructor.zip == null){
    //         selectedInstructor.zip = ''
    //     }
    //     if (selectedInstructor.emergency_first_name == null){
    //         selectedInstructor.emergency_first_name = ''
    //     }
    //     if (selectedInstructor.emergency_last_name == null){
    //         selectedInstructor.emergency_last_name = ''
    //     }
    //     if (selectedInstructor.emergency_phone == null){
    //         selectedInstructor.emergency_phone = ''
    //     } else {
    //         selectedInstructor.emergency_phone = selectedInstructor.emergency_phone.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1-$2-$3-$4")
    //     }
    //     if (selectedInstructor.dob == null){
    //         selectedInstructor.dob = ''
    //     } else {
    //         selectedInstructor.dob = dateFormat(selectedInstructor.dob, "mmmm d, yyyy")
    //     }
    //
    //     return selectedInstructor
    // };

    // handle change to input fields and call updateSelectedInstructor in InstructorDesk Component
    handleChange = (e) => {
        const selectedInstructor = this.props.selectedInstructor
        const updatedInstructor = {
            ...selectedInstructor,
            [e.target.name]: e.target.value
        };
        //call updateInstructorDetails on the InstructorDesk component
        this.props.updateInstructorDetails(updatedInstructor)
    };

    render() {
        const { mobile,
                phone,
                email,
                address,
                city,
                state,
                zip,
                emergency_first_name,
                emergency_last_name,
                emergency_phone,
                dob } = this.props.selectedInstructor;

        return (
            <div id="customer-detail-contact">
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-xs-12">
                        <figcaption>CHECKOUT CURRENCY
                            <Link to={{
                                pathname: `/modal/customer/checkouts/${this.props.selectedInstructor.membership_id}`,
                                state: {modal: true}} }>
                                {/*<button id="pin-flight-btn" className="btn btn-primary pull-right">Edit</button>*/}
                                <FontAwesome name="edit" className="pull-right" id="edit-checkout-currency-btn"/>
                            </Link>

                        </figcaption>
                        <div id="checkout-container">
                            {  Object.keys(this.state.checkout)
                                .map(key =>
                                    <InstructorCurrency key={key}
                                                        checkout={this.state.checkout[key]}/>
                                )
                            }
                            <br/>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-12 col-xs-12">
                        <form className="form">
                            <figcaption>CONTACT</figcaption>
                            <div id="phone-container" className="form-group">

                                <div id="checkout-contact-mobile">
                                    <FontAwesome name="mobile fa-2x" id="mobilePhone"/>
                                    <input id="mobileInput"
                                           type="tel"
                                           pattern="/(\d{1})(\d{3})(\d{3})(\d{4})/"
                                           name="mobile"
                                           value={this.phoneNumberFormat(mobile)}
                                           readOnly={!this.props.canEditInstructorDetail}
                                           onChange={this.handleChange}/>
                                </div>

                                <div id="checkout-contact-phone">
                                    <FontAwesome name="phone fa-2x" id="homePhone"/>
                                    <input id="homeInput"
                                           type="tel"
                                           pattern="/(\d{1})(\d{3})(\d{3})(\d{4})/"
                                           name="phone"
                                           value={this.phoneNumberFormat(phone)}
                                           readOnly={!this.props.canEditInstructorDetail}
                                           onChange={this.handleChange}/>
                                </div>

                                <div id="checkout-contact-email">
                                    <FontAwesome name="envelope-o fa-2x" id="contactEmail"/>
                                    <input id="emailInput"
                                           type="email"
                                           name="email"
                                           value={email}
                                           readOnly={true}
                                           onChange={this.handleChange}
                                    />
                                </div>

                            </div>
                        </form>
                    </div>
                </div>

                <div className="row">

                    <div className="col-lg-6 col-md-12 col-xs-12">
                        <figcaption>PILOT DOCUMENTS</figcaption>
                        <div id="pilot-document-container">
                            {  Object.keys(this.state.instructorDocuments)
                                .map(key =>
                                    <InstructorDocuments key={key}
                                                         instructorDocuments={this.state.instructorDocuments[key]}/>)
                            }
                        </div>
                    </div>

                        <div className="col-lg-6 col-md-12 col-xs-12">
                            <figcaption>FLIGHT INSTRUCTOR</figcaption>
                            <div id="pilot-document-container">
                                {  Object.keys(this.state.instructorDocuments)
                                    .map(key =>
                                        <InstructorCerts key={key}
                                                         instructorDocuments={this.state.instructorDocuments[key]} /> )
                                }
                            </div>
                        </div>
                </div>

                <div className="row">

                    <div className="col-lg-6 col-md-12 col-xs-12">
                        <form className="form">
                            <figcaption>ADDRESS</figcaption>
                            <div className="form-group" id="address-container">
                                <ul id="address-container-list">
                                    <li>
                                        <FontAwesome name="map-marker fa-2x" id="address-marker-icon"/>
                                        <input id="addressInput"
                                               type="text"
                                               name="address"
                                               value={address}
                                               readOnly={!this.props.canEditInstructorDetail}
                                               onChange={this.handleChange}
                                        />
                                    </li>
                                    <li>
                                        <input id="cityInput"
                                               type="text"
                                               name="city"
                                               value={city}
                                               readOnly={!this.props.canEditInstructorDetail}
                                               onChange={this.handleChange}
                                        />
                                        <input id="stateInput"
                                               type="text"
                                               name="state"
                                               value={state}
                                               readOnly={!this.props.canEditInstructorDetail}
                                               onChange={this.handleChange}
                                        />
                                        <input id="zipInput"
                                               type="text"
                                               name="zip"
                                               value={zip}
                                               readOnly={!this.props.canEditInstructorDetail}
                                               onChange={this.handleChange}
                                        />
                                    </li>
                                </ul>
                            </div>
                        </form>
                    </div>

                    <div className="col-lg-6 col-md-12 col-xs-12">
                        <form className="form" id="emergency-contact-info">
                            <figcaption>EMERGENCY CONTACT</figcaption>
                            <div className="form-group" id="emergency-contact-container">

                                <div id="emergency-contact-left" className="col-lg-6 col-md-12 col-xs-12">
                                <FontAwesome name="user fa-2x" id="emergencyContactIcon"/>
                                <input id="emergencyFirstNameInput"
                                       type="text"
                                       name="emergency_first_name"
                                       value={emergency_first_name}
                                       readOnly={!this.props.canEditInstructorDetail}
                                       onChange={this.handleChange}
                                />

                                <input id="emergencyLastNameInput"
                                       type="text"
                                       name="emergency_last_name"
                                       value={emergency_last_name}
                                       readOnly={!this.props.canEditInstructorDetail}
                                       onChange={this.handleChange}
                                />
                                </div>

                                <br/>
                                {/*<div id="emergency-contact-right" className="col-lg-6 col-md-12 col-xs-12 pull-right">*/}
                                <div id="emergency-contact-phone">
                                    <FontAwesome name="phone" id="homePhone"/>
                                    <input id="emergencyPhoneInput"
                                            type="tel"
                                            pattern="/(\d{1})(\d{3})(\d{3})(\d{4})/"
                                            name="emergency_phone"
                                            value={this.phoneNumberFormat(emergency_phone)}
                                            readOnly={!this.props.canEditInstructorDetail}
                                            onChange={this.handleChange}
                                />
                                </div>
                                {/*</div>*/}

                            </div>
                        </form>
                    </div>

                    <div className="col-lg-6 col-md-12 col-xs-12">
                        <form className="form">
                            <figcaption>DATES</figcaption>
                            <div className="form-group" id="dates-container">

                                <FontAwesome name="birthday-cake" id="dobIcon"/>
                                <input id="dobInput"
                                       type="text"
                                       name="dob"
                                       value={this.formatDates(dob)}
                                       readOnly={true}/>

                            </div>
                        </form>
                    </div>
                </div>

            </div>
        )
    }
}

export default InstructorDetailContact;