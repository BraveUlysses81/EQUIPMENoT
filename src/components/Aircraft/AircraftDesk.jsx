import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap'
import dateFormat from 'dateformat'
import AircraftList from './AircraftList'
import AircraftDetailContainer from './AircraftDetailContainer'
import { getAllAircraft, updateAircraft, getSearchAircraft } from '../../actions/aircraftActions'
import { connect } from 'react-redux'
import './aircraft.css'

const validateInput = require('../../../routes/shared/aircraftDetailValidation');


class AircraftDesk extends React.Component {

    constructor(props) {
        super(props);
    }
    state = {
        aircrafts: {},
        selectedAircraft: {},
        aircraftIsSelected: false,
        canEditAircraftDetail: false,
        errors: {},
        isFetching: false
    };

    static PropTypes = {
        school_id: PropTypes.number.isRequired,
        getAllAircraft: PropTypes.func.isRequired,
        updateAircraft: PropTypes.func.isRequired,
        getSearchAircraft: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.context.router.history.push(`/aircraft`);
        //load aircraft list
        this.getAircraft();
        //check for selected aircraft in session storage
        const sessionStorageAircraft = sessionStorage.getItem('lastSelectedAircraft');
        //if fired from search click selected customer id will be stored in props.location.state
        if(this.props.location.state && this.props.location.state.id) {
            this.handleSearchRequest(this.props.location.state.id)
        } else if(sessionStorageAircraft) {
            if (sessionStorageAircraft !== 'undefined' ) {
                this.selectAircraft(JSON.parse(sessionStorageAircraft))
            }
        }
    }

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

    formatDates = (date) => {
        if(date){
            return (dateFormat(date, 'isoDate'))
        } else {
            return('')
        }
    };

    replaceAircraftNullFields = (aircraft) => {
        aircraft.make = aircraft.make || '';
        aircraft.registration_nbr = aircraft.registration_nbr || '';
        aircraft.model_id = aircraft.model_id || '';
        aircraft.popular_name = aircraft.popular_name || '';
        aircraft.hobbs = aircraft.hobbs || '';
        aircraft.tach = aircraft.tach || '';
        aircraft.hundred_hr_inspection = aircraft.hundred_hr_inspection || '';
        aircraft.pitot_static_inspection = this.formatDates(aircraft.pitot_static_inspection) || '';
        aircraft.vor_check = this.formatDates(aircraft.vor_check) || '';
        aircraft.transponder_certification = this.formatDates(aircraft.transponder_certification) || '';
        aircraft.elt_certification = this.formatDates(aircraft.elt_certification) || '';
        aircraft.ifr_certificate = aircraft.ifr_certificate || false;
        aircraft.night_certificate = aircraft.night_certificate || false;
        aircraft.gps_database_update = this.formatDates(aircraft.gps_database_update) || '';
        aircraft.parachute = aircraft.parachute || false;
        aircraft.glass_cockpit = aircraft.glass_cockpit || false;
        aircraft.auto_pilot = aircraft.auto_pilot || false;
        aircraft.airbags = aircraft.airbags || false;
        aircraft.engine = aircraft.engine || '';
        aircraft.gps = aircraft.gps || false;

        return aircraft;
    };

    getAircraft = () => {
        this.props.getAllAircraft(this.props.school_id)
            .then((data) => {
                //map through the data array and send each result to addAircraft
                data.data.map((i) =>  {
                    const aircrafts = {...this.state.aircrafts};
                    aircrafts[`aircraft-${i.aircraft_id}`] = this.replaceAircraftNullFields(i);
                    this.setState({ aircrafts });
                })
            })
            .catch(function (error) {
                console.log(error)
            })

    };

    selectAircraft = (selectedAircraft) => {
        // set customerIsSelected to true so CustomerDetailContainer is rendered and reset canEditCustomerDetail
        this.setState({ selectedAircraft, aircraftIsSelected: true, canEditAircraftDetail: false});
        //push to history to so clear handleSearchRequest from firing in componentWill update and to set history for modal
        this.context.router.history.push(`/aircraft/${selectedAircraft.aircraft_id}`)
    };

    handleSearchRequest = (searchId) => {
        this.props.getSearchAircraft(this.props.school_id, searchId)
            .then((aircraft) => {
                this.selectAircraft(this.replaceAircraftNullFields(aircraft.data))
            })
            .catch((err) => {
                console.log(err)
            })
    };

    editAircraftDetail = () => {
        const { canEditAircraftDetail } = this.state;
        this.setState({ canEditAircraftDetail: !canEditAircraftDetail })
    };

    handleDetailsChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const selectedAircraft = this.state.selectedAircraft;
        const updatedAircraft = {
            ...selectedAircraft,
            [e.target.name]: value
        };
        this.setState({ selectedAircraft: updatedAircraft})
    };

    isvalid = () => {
        const { errors, isValid } = validateInput(this.state.selectedAircraft);
        if(!isValid) {
            this.setState({ errors })
        }
        return isValid
    };

    handleDetailsSubmit = (e) => {
        e.preventDefault();

        const { selectedAircraft } = this.state;
        this.setState({ errors: {}, isFetching: true });

        if(this.isvalid()) {

            //call updateCustomerDetails on the CustomerDesk component
            this.props.updateAircraft(selectedAircraft)
                .then( () => {
                    //update aircraft list in state
                    const aircrafts = {...this.state.aircrafts};
                    aircrafts[`aircraft-${selectedAircraft.aircraft_id}`] = selectedAircraft;
                    this.setState({aircrafts, canEditAircraftDetail: !this.state.canEditAircraftDetail})
                })
                .catch((err) => {
                console.log(err)
                })
        }
    };

    render() {
        return (
            <div id="CustomerDesk">
                <Navbar id="customer-desk-nav" >
                        <Nav id="customer-desk-nav-item" >
                            <NavDropdown eventKey="1" title="Aircraft Tasks" id="customer-desk-nav-button">
                                <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/add/aircraft`, state: {modal: false}}} >
                                    <MenuItem eventKey="1.1">
                                        <div id="quick-add-customer-button">
                                            Add Aircraft
                                        </div>
                                    </MenuItem>
                                </LinkContainer>
                                <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/modal/${this.props.school_id}/dispatch/?`, state: {modal: true}}} >
                                    <MenuItem eventKey="1.2">
                                        <div id="quick-add-customer-button">
                                            Dispatch Aircraft
                                        </div>
                                    </MenuItem>
                                </LinkContainer>
                                <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/modal/aircraft/ground`, state: {modal: true}}} >
                                    <MenuItem eventKey="1.3">
                                        <div id="quick-add-customer-button">
                                            Ground / Unground Aircraft
                                        </div>
                                    </MenuItem>
                                </LinkContainer>
                            </NavDropdown>
                        </Nav>
                </Navbar>
                <AircraftList aircrafts={this.state.aircrafts}
                                  selectAircraft={this.selectAircraft}
                />
                <AircraftDetailContainer selectedAircraft={this.state.selectedAircraft}
                                         aircraftIsSelected={this.state.aircraftIsSelected}
                                         editAircraftDetail={this.editAircraftDetail}
                                         canEditAircraftDetail={this.state.canEditAircraftDetail}
                                         handleDetailsChange={this.handleDetailsChange}
                                         handleDetailsSubmit={this.handleDetailsSubmit}
                                         errors={this.state.errors}
                />
            </div>
        )
    }
}

AircraftDesk.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        school_id: state.member.school_id
    }
};

export default connect(mapStateToProps, { getAllAircraft, updateAircraft, getSearchAircraft })(AircraftDesk);