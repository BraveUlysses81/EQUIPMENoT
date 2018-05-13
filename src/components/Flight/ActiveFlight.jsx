import React from 'react'
import { render } from 'react-dom'
import axios from 'axios'
import FontAwesome from 'react-fontawesome';
import dateFormat from 'dateformat'
import { server } from '../../helpers/serverAddress'

// Individual Flight Component

class ActiveFlight extends React.Component {
    // set state
    state = {
        selectedAircraft: {},
        flights: {},
        selectedFlight: {}
    };

    constructor() {
        super();
    }

    onClick(aircraft){
    }

    componentWillMount() {
        // Loads the Aircraft
        this.getFlights(this.props.activeAircraft)
    }

    getFlights(activeAircraft) {
        this.setState({ flights: "" });
        axios.get(`${server}/school/flights/1/${activeAircraft.registration_nbr}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }} )
            .then((data) => {
                data.data.map((i) => {
                    const flights = {...this.state.flights};
                    flights[`flights-${i.flight_id}`] = i;
                    this.setState({ flights })
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    // isActiveCustomer = () => {
    //     let isActive = Object.keys(this.state.flights).map(key => this.state.flights[key].status);
    //     if (isActive == 'Active') {
    //         return (
    //             <div href="#" id="active-customer-name">
    //                 {Object.keys(this.state.flights).map(key => this.state.flights[key].customer_last_name)}
    //             </div>
    //                 )
    //         }
    //
    // };

    dispatchCheck = () => {
        let dispatched = null;

        // if ( dispatched === null ) { return ("")}
        // else

            if (Object.keys(this.state.flights).map(key => this.state.flights[key].dispatched_by)) {
            return (
                <div>
                    <div id="dispatch-time">
                        dispatched at {Object.keys(this.state.flights).slice(0, 1).map(key => dateFormat (this.state.flights[key].dispatch_time, "shortTime"))}
                    </div>
                    <br/>
                    <div id="dispatch-by">
                        by {Object.keys(this.state.flights).slice(0, 1).map(key => this.state.flights[key].dispatcher_first_name)} {Object.keys(this.state.flights).slice(0, 1).map(key => this.state.flights[key].dispatcher_last_name)}
                    </div>
                </div>
            )
        } else {
                return ("")
            }
    };

    render () {
        return (

            <button type="button"
                    onClick={ () => this.props.renderAircraftDetail( this.props.activeAircraft, this.state.flights ) }
                    id="flight-object"
                    className="btn btn-default">

                <div id="flight-registration-container">
                    <div id="flight-registration">
                        {this.props.activeAircraft.registration_nbr}


                        {/* If sms_id == null */}
                        <img id="dispatch-sms-status-image" src={ '/img/keywhite.png' } />

                        {/*else*/}
                        {/*<img id="dispatch-sms-status-image" src={ '/img/plane.png' } />*/}

                    </div>
                    <div id="status-bar-container">
                        <hr id="status-bar-phase-check" />
                    </div>
                </div>

                <div id="active-info" className="container">

                    <div id="active-customer">
                        <div href="#" id="active-customer-name">
                            {Object.keys(this.state.flights).slice(0, 1).map(key => this.state.flights[key].customer_last_name)}
                        </div>
                    </div>

                    <div id="active-instructor">
                        <div href="#" id="active-instructor-name">
                            {Object.keys(this.state.flights).slice(0, 1).map(key => this.state.flights[key].employee_last_name)}
                        </div>
                    </div>

                    <br/>


                    <div id="active-dispatch">
                        {this.dispatchCheck()}

                        {/*<div id="dispatch-time">*/}
                            {/*dispatched at {Object.keys(this.state.flights).slice(0, 1).map(key => dateFormat (this.state.flights[key].dispatch_time, "shortTime"))}*/}
                        {/*</div>*/}

                        {/*<div id="dispatch-by">*/}
                            {/*by {Object.keys(this.state.flights).slice(0, 1).map(key => this.state.flights[key].dispatcher_first_name)} {Object.keys(this.state.flights).slice(0, 1).map(key => this.state.flights[key].dispatcher_last_name)}*/}
                        {/*</div>*/}
                    </div>
                </div>
                {
                    this.isActive
                }
            </button>
        )
    }
}


export default ActiveFlight