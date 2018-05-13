// EQUIP.ME.NoT Customer Desk

import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import './customer.css'
import CustomerList from './CustomerList'
import CustomerDetailContainer from './CustomerDetailContainer'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { updateCustomer, getCustomers } from '../../actions/customerActions'
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap'
import getProfileImage from '../../helpers/getProfileImage';

const config = require('../../../config/config')


class CustomerDesk extends React.Component {

    constructor(props) {
        super(props)
    }

    state = {
        customers: {},
        selectedCustomer: {},
        customerIsSelected: false,
        canEditCustomerDetail: false
    };

    static propTypes = {
        school_id: PropTypes.number.isRequired,
        getCustomers: PropTypes.func.isRequired,
        updateCustomer: PropTypes.func.isRequired
    }

    componentWillMount() {
        //load customer list
        this.getAllCustomers()
        //check for selected customer in session storage
        const sessionStorageCustomer = sessionStorage.getItem('lastSelectedCustomer')
        //check for selected customer form either search click or session storage
        if(this.props.location.state && this.props.location.state.id) {
            this.handleSearchRequest(this.props.location.state.id)
        //if fired from search click selected customer id will be stored in props.location.state
        } else if(sessionStorageCustomer) {
            if (sessionStorageCustomer !== 'undefined' ) {
                this.selectCustomer(JSON.parse(sessionStorageCustomer))
            }
        }
    }

    componentWillUpdate(nextProps, nextState) {
        //check if update is from search bar click
        if (nextProps.location.state) {
            const nextSearchId = nextProps.location.state.id
            if (nextSearchId) {
                 this.handleSearchRequest(nextSearchId)
             }
        } else if (Object.keys(nextState.selectedCustomer).length !== 0) {
            sessionStorage.setItem('lastSelectedCustomer', JSON.stringify(nextState.selectedCustomer))
        }
    }

    replaceCustomerNullFields = (customer) => {

        customer.address = customer.address || '';
        customer.city = customer.city || '';
        customer.state = customer.state || '';
        customer.zip = customer.zip || '';
        customer.email = customer.email || '';
        customer.phone = customer.phone || '';
        customer.mobile = customer.mobile || '';
        //customer.dob = customer.dob || '';
        customer.emergency_first_name = customer.emergency_first_name || '';
        customer.emergency_last_name = customer.emergency_last_name || '';
        customer.emergency_phone = customer.emergency_phone || '';
        return customer;
    };

    //Call to customers/:schoolID/all route and update customers state
    getAllCustomers = () => {
        this.props.getCustomers(this.props.school_id)
            .then( (data) => {
                //map through the data array and send each result to addCustomer
                data.data.map((i) => {
                    //get customer profile image
                    i.profile = getProfileImage(i);
                    //update with current state
                    const customers = {...this.state.customers};
                    //index customer and add to the customers array
                    customers[`${i.person_id}`] = this.replaceCustomerNullFields(i);
                    //set state
                    this.setState({customers});
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    //called when a customer component is clicked from the Customer list
    selectCustomer = (selectedCustomer) => {
        // set customerIsSelected to true so CustomerDetailContainer is rendered and reset canEditCustomerDetail
        this.setState({ selectedCustomer, customerIsSelected: true, canEditCustomerDetail: false})
        this.context.router.history.push(`/customers/${selectedCustomer.person_id}`)
    };

    editCustomerDetail = () => {
        this.setState({ canEditCustomerDetail: !this.state.canEditCustomerDetail })
    };

    handleSearchRequest = (searchId) => {
        const { customers } = this.state
        // map through customers object to match searchId
        Object.keys(customers).some(key => {
            if(key === searchId) {
                this.selectCustomer(customers[key]);
            }
        })
    };

    updateCustomerDetails = (updatedCustomer) => {
        this.props.updateCustomer(updatedCustomer)
            .then( () => {
                this.setState({ selectedCustomer: updatedCustomer })
                //update customers array with updated customer
                const customers = {...this.state.customers}
                customers[`${updatedCustomer.person_id}`] = updatedCustomer
                this.setState({ customers })
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    //Render the Customer Desk component
    render() {
        return (
            <div id="CustomerDesk">
                <Navbar id="customer-desk-nav" >
                        <Nav id="customer-desk-nav-item" >
                            <NavDropdown eventKey="1" title="Customer Tasks" id="customer-desk-nav-button">
                                <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/add/customer`, state: {modal: false}}} >
                                    <MenuItem eventKey="1.1">
                                        <div id="quick-add-customer-button">
                                            Quick Add Customer
                                        </div>
                                    </MenuItem>
                                </LinkContainer>
                                <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/modal/${this.props.school_id}/dispatch/${this.state.selectedCustomer.person_id}`, state: {modal: true}}} >
                                    <MenuItem eventKey="1.2">
                                        <div id="quick-add-customer-button">
                                            Dispatch Customer
                                        </div>
                                    </MenuItem>
                                </LinkContainer>
                            </NavDropdown>
                        </Nav>
                </Navbar>

                <CustomerList customers={this.state.customers}
                              selectCustomer={this.selectCustomer}
                />

                <CustomerDetailContainer selectedCustomer={this.state.selectedCustomer}
                                         customerIsSelected={this.state.customerIsSelected}
                                         editCustomerDetail={this.editCustomerDetail}
                                         canEditCustomerDetail={this.state.canEditCustomerDetail}
                                         updateCustomerDetails={this.updateCustomerDetails}
                />
            </div>
        )
    }
}

CustomerDesk.contextTypes = {
    router: PropTypes.object.isRequired
}

const mapStateToProps = state => {
    return {
        school_id: state.member.school_id
    }
}

export default connect(mapStateToProps, { updateCustomer, getCustomers })(CustomerDesk);
