
import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import dateFormat from 'dateformat'
import axios from 'axios'
import { connect } from 'react-redux'
import PilotDocuments from './PilotDocuments'
import { Link } from 'react-router-dom'
import CustomerCurrency from './CustomerCurrency'
import { getCustomerDocuments } from '../../actions/customerActions'

const validateInput = require('../../../routes/shared/mobileContactFormValidation');


class CustomerDetailContact extends React.Component  {

    state = {
        errors: '',
        checkout: '',
        pilotDocuments: ''
    };

    constructor(){
        super()
    }

    static propTypes = {
        canEditCustomerDetail: PropTypes.bool.isRequired,
        getCustomerDocuments: PropTypes.func.isRequired,
        selectedCustomer: PropTypes.object.isRequired
    };

    componentWillMount() {
        this.getCheckouts(this.props.selectedCustomer)
    }

    componentWillReceiveProps(nextProps) {

        // Check if selectedCustomer has changed and then update state
        if (nextProps.selectedCustomer !== this.props.selectedCustomer) {
            let nextSelectedCustomer = nextProps.selectedCustomer;

            //update checkouts
            this.getCheckouts(nextSelectedCustomer)

        }

    }

    getCheckouts = (selectedCustomer) => {
        // Reset checkout & pilot Documents
        this.setState({checkout: [], pilotDocuments: [] });
        // API call to get checkouts
        this.props.getCustomerDocuments(selectedCustomer.membership_id, selectedCustomer.person_id)
            .then(axios.spread((checkouts, pilotDocuments) => {
            checkouts.data.map((i) => {
                    const checkout = {...this.state.checkout}; //create a copy of the checkout state
                    checkout[`checkout-${i.checkout_id}`] = i; // add the checkout to the checkout copy
                    this.setState({ checkout }) //call set state with the updated copy
                });
            pilotDocuments.data.map((i) => {
                const pilotDocuments = {...this.state.pilotDocuments}; //create a copy of the checkout state
                pilotDocuments[`membership-${i.person_id}`] = i; // add the checkout to the checkout copy
                this.setState({ pilotDocuments }) //call set state with the updated copy
            })
            }))
            .catch(function (error) {
                console.log(error)
            })
    };

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

    // handle change to input fields and call updateSelectedCustomer in CustomerDesk Component
    handleChange = (e) => {
            const selectedCustomer = this.props.selectedCustomer;
            const updatedCustomer = {
                ...selectedCustomer,
                [e.target.name]: e.target.value
            };
            //call updateCustomerDetails on the CustomerDesk component
            this.props.updateCustomerDetails(updatedCustomer)
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
                dob } = this.props.selectedCustomer;

        return (
            <div id="customer-detail-contact">
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-xs-12">
                        <figcaption>CHECKOUT CURRENCY
                            <Link to={{
                                pathname: `/modal/customer/checkouts/${this.props.selectedCustomer.membership_id}`,
                                state: {modal: true}} }>
                                {/*<button id="pin-flight-btn" className="btn btn-primary pull-right">Edit</button>*/}
                                <FontAwesome name="edit" className="pull-right" id="edit-checkout-currency-btn"/>
                            </Link>

                        </figcaption>
                        <div id="checkout-container">
                            {  Object.keys(this.state.checkout)
                                .map(key =>
                                    <CustomerCurrency key={key}
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
                                               readOnly={!this.props.canEditCustomerDetail}
                                               onChange={this.handleChange}/>
                                </div>

                                <div id="checkout-contact-phone">
                                    <FontAwesome name="phone fa-2x" id="homePhone"/>
                                        <input id="homeInput"
                                               type="tel"
                                               pattern="/(\d{1})(\d{3})(\d{3})(\d{4})/"
                                               name="phone"
                                               value={this.phoneNumberFormat(phone)}
                                               readOnly={!this.props.canEditCustomerDetail}
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
                            {  Object.keys(this.state.pilotDocuments)
                                .map(key =>
                                    <PilotDocuments key={key}
                                                    pilotDocuments={this.state.pilotDocuments[key]}/>)
                            }
                        </div>
                    </div>

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
                                               readOnly={!this.props.canEditCustomerDetail}
                                               onChange={this.handleChange}
                                        />
                                    </li>
                                    <li>
                                        <input id="cityInput"
                                               type="text"
                                               name="city"
                                               value={city}
                                               readOnly={!this.props.canEditCustomerDetail}
                                               onChange={this.handleChange}
                                        />
                                        <input id="stateInput"
                                               type="text"
                                               name="state"
                                               value={state}
                                               readOnly={!this.props.canEditCustomerDetail}
                                               onChange={this.handleChange}
                                        />
                                        <input id="zipInput"
                                               type="text"
                                               name="zip"
                                               value={zip}
                                               readOnly={!this.props.canEditCustomerDetail}
                                               onChange={this.handleChange}
                                        />
                                    </li>
                                </ul>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="row">

                    <div className="col-lg-6 col-md-12 col-xs-12">
                        <form className="form">
                            <figcaption>EMERGENCY CONTACT</figcaption>
                            <div className="form-group" id="phone-container">

                                <div id="emergency-contact-left" className="col-lg-6 col-md-12 col-xs-12">
                                <FontAwesome name="user" id="emergencyContactIcon"/>
                                <input id="emergencyFirstNameInput"
                                       type="text"
                                       name="emergency_first_name"
                                       value={emergency_first_name}
                                       readOnly={!this.props.canEditCustomerDetail}
                                       onChange={this.handleChange}
                                />

                                <input id="emergencyLastNameInput"
                                       type="text"
                                       name="emergency_last_name"
                                       value={emergency_last_name}
                                       readOnly={!this.props.canEditCustomerDetail}
                                       onChange={this.handleChange}
                                />
                                </div>

                                <br/>

                                <div id="emergency-contact-phone">
                                    <FontAwesome name="phone fa-2x" id="homePhone"/>
                                    <input id="emergencyPhoneInput"
                                           type="tel"
                                           pattern="/(\d{1})(\d{3})(\d{3})(\d{4})/"
                                           name="emergency_phone"
                                           value={this.phoneNumberFormat(emergency_phone)}
                                           readOnly={!this.props.canEditCustomerDetail}
                                           onChange={this.handleChange}
                                    />
                                </div>

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

export default connect(null, { getCustomerDocuments })(CustomerDetailContact);