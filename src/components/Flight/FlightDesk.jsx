// EQUIP.ME.NoT Flight Desk
import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import './flight.css'
import axios from 'axios'
import ActiveFlights from './ActiveFlights'
import FlightlineFlights from './FlightlineFlights'
import AoGFlights from './AoGFlights'
import FlightDetail from './FlightDetail'
import '../Customer/customer.css'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap'
import { server } from '../../helpers/serverAddress'


// Flight Desk Component
class FlightDesk extends React.Component {

    constructor(props) {
        super(props);
    }
    // set initial state
    state = {
        flights: {},
        aircraft: {},
        selectedAircraft: {},
        selectedFlight: {},
        canEditAircraftDetail: false,
        aircraftIsSelected: false,
        flightIsSelected: false,
        statusText: {},
        completedFlights: {},
        pinnedFlights: {},
        activeFlights: {}
    };

    componentWillMount() {
        //load aircraft
        this.getAircraft();
        // check if the Aircraft is in session storage
        const sessionStorageAircraft = sessionStorage.getItem('lastSelectedAircraft');
        //if fired from search click selected aircraft id will be stored in props.location.state
        if (this.props.location.state && this.props.location.state.id) {
            this.handleSearchRequest(this.props.location.state.id)
        } else if (sessionStorageAircraft) {
            if (sessionStorageAircraft !== 'undefined' ) {
                this.renderAircraftDetail(JSON.parse(sessionStorageAircraft))
            }
        }
    }

    // componentDidMount() {
    //     // Loads the Aircraft
    //     this.getAircraft()
    //     // this.getFlights()
    // }

    componentWillUpdate(nextProps, nextState) {
        //check if update is from search bar click
        if (nextProps.location.state) {
            const nextSearchId = nextProps.location.state.id;
            if (nextSearchId) {
                this.handleSearchRequest(nextSearchId)
            }
        } else if (Object.keys(nextState.selectedAircraft).length !== 0) {
            sessionStorage.setItem('lastSelectedAircraft', JSON.stringify(nextState.selectedAircraft))
        }
    }

    handleSearchRequest = (searchId) => {
        axios.get(`${server}/aircraft/${this.props.schoolId}/${searchId}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }})
            .then((selectedAircraft) => {
                selectedAircraft.data.map((i) => {
                    this.selectAircraft(i)
                })
            })
    };

    // Call to schools/:schoolId/aircraft route and update flights state
    getAircraft = () => {
        axios.get(`${server}/schools/aircraft/${this.props.schoolId}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }} )
            .then( (data) => {
                // map through the data array and send each result to addFlight
                data.data.map((i) => {
                    // update with current state
                    if(i.aircraft_status === 'active') {
                        const activeStatus = {...this.state.activeStatus};
                        activeStatus[`aircraft-${i.aircraft_id}`] = i;
                        // set state
                        this.setState({activeStatus})
                    } else if(i.aircraft_status === 'flight_line') {
                        const flightlineStatus = {...this.state.flightlineStatus};
                        flightlineStatus[`aircraft-${i.aircraft_id}`] = i;
                        // set state
                        this.setState({flightlineStatus})
                    } else if(i.aircraft_status === 'grounded') {
                        const AoGStatus = {...this.state.AoGStatus};
                        AoGStatus[`aircraft-${i.aircraft_id}`] = i;
                        // set state
                        this.setState({AoGStatus})
                    }
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    // called when an Aircraft component is clicked from the Aircraft list
    renderAircraftDetail = (selectedAircraft, selectedFlight) => {

        // sets aircraftIsSelected and flightIsSelected to true so AircraftDetail is rendered and resets canEditAircraftDetail
        if(selectedFlight) {
            this.setState({ completedFlights: {}, pinnedFlights: {}, activeFlights: {} });
            const completedFlights = {};
            const pinnedFlights = {};
            const activeFlights = {};
            Object.keys(selectedFlight).map(key => {
                if (selectedFlight[key].flight_status === 'completed') {
                    completedFlights[key] = selectedFlight[key];
                    this.setState({completedFlights})
                }
                else if (selectedFlight[key].flight_status === 'pinned') {
                    pinnedFlights[key] = selectedFlight[key];
                    this.setState({pinnedFlights})
                }
                else if (selectedFlight[key].flight_status === 'dispatched' || selectedFlight[key].flight_status === 'in_flight') {
                    activeFlights[key] = selectedFlight[key];
                    this.setState({activeFlights})
                }
            })
        }
        this.setState({ selectedAircraft: selectedAircraft, selectedFlight: selectedFlight });
        this.setState({ aircraftIsSelected: true, flightIsSelected: true, canEditAircraftDetail: false });
        this.context.router.history.push(`/dispatch`)
    };

    editAircraftDetail() {
        this.setState({ canEditAircraftDetail: true })
    }

    // Render the Flight Desk component
    render() {
        let aircraftIsSelected = this.state.aircraftIsSelected;

        return (
            <div id="FlightDesk">
                <Navbar id="customer-desk-nav" >
                        <Nav id="customer-desk-nav-item" >
                            <NavDropdown eventKey="1" title="Flight Tasks" id="customer-desk-nav-button">
                                <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/add/customer`, state: {modal: false}}} >
                                    <MenuItem eventKey="1.1">
                                        <div id="quick-add-customer-button">
                                            Quick Add Customer
                                        </div>
                                    </MenuItem>
                                </LinkContainer>
                                <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/modal/${this.props.schoolId}/dispatch/${this.props.personId}`, state: {modal: true}}} >
                                    <MenuItem eventKey="1.2">
                                        <div id="quick-add-customer-button">
                                            Dispatch Customer
                                        </div>
                                    </MenuItem>
                                </LinkContainer>
                                <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/closeflight`, state: {modal: false}}} >
                                    <MenuItem eventKey="1.2">
                                        <div id="quick-add-customer-button">
                                            Close Flights
                                        </div>
                                    </MenuItem>
                                </LinkContainer>
                            </NavDropdown>
                        </Nav>
                </Navbar>
                <div id="flight-list-group" className="container pull-left">
                    {
                        this.state.activeStatus &&
                        <ActiveFlights
                            aircraft={this.state.activeStatus}
                            selectedAircraft={this.state.selectedAircraft}
                            selectedFlight={this.state.selectedFlight}
                            renderAircraftDetail={this.renderAircraftDetail}/>
                    }
                    {
                        this.state.flightlineStatus &&
                        <FlightlineFlights
                            aircraft={this.state.flightlineStatus}
                            selectedAircraft={this.state.selectedAircraft}
                            selectedFlight={this.state.selectedFlight}
                            renderAircraftDetail={this.renderAircraftDetail}/>
                    }
                    {

                        this.state.AoGStatus &&
                        <AoGFlights
                            aircraft={this.state.AoGStatus}
                            selectedAircraft={this.state.selectedAircraft}
                            selectedFlight={this.state.selectedFlight}
                            renderAircraftDetail={this.renderAircraftDetail}/>
                    }
                </div>
                {/*check if an Aircraft has been selected and only render if true*/}
                {
                    aircraftIsSelected &&
                    <FlightDetail
                        selectedAircraft={this.state.selectedAircraft}
                        selectedFlight={this.state.selectedFlight}
                        flights={this.state.flights}
                        completedFlights={this.state.completedFlights}
                        pinnedFlights={this.state.pinnedFlights}
                        activeFlights={this.state.activeFlights}
                        editAircraftDetail={this.editAircraftDetail}
                        canEditAircraftDetail={this.state.canEditAircraftDetail}/>
                }
            </div>
        )
    }
}

FlightDesk.contextTypes = {
    router: PropTypes.object.isRequired
};


const mapStateToProps = state => {
    return {
        schoolId: state.member.school_id,
        personId: state.user.person_id
    }
}

export default connect(mapStateToProps)(FlightDesk);