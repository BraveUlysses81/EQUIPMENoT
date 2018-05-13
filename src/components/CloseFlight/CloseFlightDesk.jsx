import React, { Component } from 'react';
import CompletedFlightList from './CompletedFlightList';
import { getCompletedFlights } from '../../actions/closeFlightActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap';

class CloseFlightDesk extends Component {

    constructor(props) {
        super(props)
    }

    state = {
        completedFlights: {}
    }

    componentWillMount() {
       this.props.getCompletedFlights(this.props.school_id)
           .then((data) => {
               data.data.map((i) => {
                   const completedFlights = {...this.state.completedFlights}
                   //index customer and add to the customers array
                   completedFlights[`${i.flight_id}`] = i
                   //set state
                   this.setState({ completedFlights })
               })
           })
           .catch((err) => {

           })
        this.context.router.history.push(`/closeflight`)
    }

    render() {
        const { completedFlights } = this.state
        return (
            <div id="AdminDesk"><Navbar id="customer-desk-nav" >
                <Nav id="customer-desk-nav-item" >
                    <NavDropdown eventKey="1" title="Flight Tasks" id="customer-desk-nav-button">
                        <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/add/customer`, state: {modal: false}}} >
                            <MenuItem eventKey="1.1">
                                <div id="quick-add-customer-button">
                                    Quick Add Customer
                                </div>
                            </MenuItem>
                        </LinkContainer>
                        <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/modal/${this.props.school_id}/dispatch/${this.props.person_id}`, state: {modal: true}}} >
                            <MenuItem eventKey="1.2">
                                <div id="quick-add-customer-button">
                                    Dispatch Customer
                                </div>
                            </MenuItem>
                        </LinkContainer>
                    </NavDropdown>
                </Nav>
            </Navbar>
                <section className="row text-center placeholders">
                    <main id="admin-manage-invites-main" className="col-sm-9 col-md-10" >
                        <h1 id="admin-manage-invites-head">Close Flights</h1>
                        <br/>
                        <div className="table-responsive">
                            <table className="table table-stripped">
                                <thead>
                                    <tr id="admin-manage-invites-header-row">
                                        <th>Flight ID</th>
                                        <th>Aircraft Registration Nbr</th>
                                        <th>Flight Date</th>
                                        <th>Flight Type</th>
                                        <th>Customer First Name</th>
                                        <th>Customer Last Name</th>
                                        <th>Instructor First Name</th>
                                        <th>Instructor Last Name</th>
                                        <th/>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    Object.keys(completedFlights).map(key =>
                                        <CompletedFlightList  completeFlight={completedFlights[key]}
                                                        key={key}
                                                        flightID={key}
                                        />
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </main>
                </section>
            </div>
        )
    }
}

CloseFlightDesk.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        school_id: state.member.school_id,
        person_id: state.user.person_id
    }
}

export default connect(mapStateToProps, { getCompletedFlights })(CloseFlightDesk);