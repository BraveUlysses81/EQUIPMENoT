import React from 'react'
import { render } from 'react-dom'
import axios from 'axios'
import FontAwesome from 'react-fontawesome'
import { server } from '../../helpers/serverAddress'


// Individual Flight Component

class FlightlineFlight extends React.Component {
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
        this.getFlights(this.props.flightlineAircraft)
    }

    getFlights(flightlineAircraft) {
        this.setState({ flights: "" })
        axios.get(`${server}/school/flights/1/${flightlineAircraft.registration_nbr}`,
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

    render () {

        // let isCompleted = Object.keys(this.state.flights).map(key => this.state.flights[key].flight_status);

        // if ((isCompleted == 'completed') || (isCompleted == 'completed' && isCompleted == 'pinned')) {
        //     return(
        //         <button type="button" onClick={ () => this.props.renderAircraftDetail( this.props.flightlineAircraft, this.state.flights ) }
        //                 id="flight-object" className="btn btn-default">
        //             <div id="flight-registration">
        //                 {this.props.flightlineAircraft.registration_nbr}
        //                 <img id="close-flight-alert" src={ '/img/caution.png' } />
        //             </div>
        //             <div id="flight-hr-container">
        //                 <hr />
        //             </div>
        //             <div id="close-flight-text-alert">
        //                 CLOSE FLIGHT!
        //             </div>
        //         </button>
        //     )
        // } else {
            return (
                <button type="button"
                        onClick={ () => this.props.renderAircraftDetail(this.props.flightlineAircraft, this.state.flights ) }
                        id="flight-object"
                        className="btn btn-default">

                    <div id="flight-registration-container">
                        <div id="flight-registration">
                            {this.props.flightlineAircraft.registration_nbr}
                        </div>

                        <div id="flight-hr-container">
                            <hr />
                        </div>
                    </div>

                    <div id="flightline-info" className="container">
                        <div id="flightline-flight-list-item">
                            <div id="flightline-customer">
                                <div href="#" id="flightline-customer-name">
                                    {Object.keys(this.state.flights).map(key => this.state.flights[key].customer_last_name + ' ')[0]}
                                </div>
                            </div>
                            <div id="flightline-instructor">
                                <div href="#" id="flightline-instructor-name">
                                    {Object.keys(this.state.flights).map(key => this.state.flights[key].employee_last_name)[0]}
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div id="flightline-customer">
                            <div href="#" id="flightline-customer-name">
                                {Object.keys(this.state.flights).map(key => this.state.flights[key].customer_last_name + ' ')[1]}
                            </div>
                        </div>
                        <div id="flightline-instructor">
                            <div href="#" id="flightline-instructor-name">
                                {Object.keys(this.state.flights).map(key => this.state.flights[key].employee_last_name)[1]}
                            </div>
                        </div>
                        <br/>
                        <div id="flightline-customer">
                            <div href="#" id="flightline-customer-name">
                                {Object.keys(this.state.flights).map(key => this.state.flights[key].customer_last_name + ' ')[2]}
                            </div>
                        </div>
                        <div id="flightline-instructor">
                            <div href="#" id="flightline-instructor-name">
                                {Object.keys(this.state.flights).map(key => this.state.flights[key].employee_last_name)[2]}
                            </div>
                        </div>
                        <br/>
                        <div id="flightline-customer">
                            <div href="#" id="flightline-customer-name">
                                {Object.keys(this.state.flights).map(key => this.state.flights[key].customer_last_name + ' ')[3]}
                            </div>
                        </div>
                        <div id="flightline-instructor">
                            <div href="#" id="flightline-instructor-name">
                                {Object.keys(this.state.flights).map(key => this.state.flights[key].employee_last_name)[3]}
                            </div>
                        </div>
                        <br/>
                        <div id="flightline-customer">
                            <div href="#" id="flightline-customer-name">
                                {Object.keys(this.state.flights).map(key => this.state.flights[key].customer_last_name + ' ')[4]}
                            </div>
                        </div>
                        <div id="flightline-instructor">
                            <div href="#" id="flightline-instructor-name">
                                {Object.keys(this.state.flights).map(key => this.state.flights[key].employee_last_name)[4]}
                            </div>
                        </div>
                        {/*<br/>*/}
                        {/*<div id="flightline-customer">*/}
                            {/*<div href="#" id="flightline-customer-name">*/}
                                {/*{Object.keys(this.state.flights).map(key => this.state.flights[key].customer_last_name + ' ')[5]}*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<div id="flightline-instructor">*/}
                            {/*<div href="#" id="flightline-instructor-name">*/}
                                {/*{Object.keys(this.state.flights).map(key => this.state.flights[key].employee_last_name)[5]}*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<br/>*/}
                        {/*<div id="flightline-customer">*/}
                            {/*<div href="#" id="flightline-customer-name">*/}
                                {/*{Object.keys(this.state.flights).map(key => this.state.flights[key].customer_last_name + ' ')[6]}*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<div id="flightline-instructor">*/}
                            {/*<div href="#" id="flightline-instructor-name">*/}
                                {/*{Object.keys(this.state.flights).map(key => this.state.flights[key].employee_last_name)[6]}*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<br/>*/}
                        {/*<div id="flightline-customer">*/}
                            {/*<div href="#" id="flightline-customer-name">*/}
                                {/*{Object.keys(this.state.flights).map(key => this.state.flights[key].customer_last_name + ' ')[7]}*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<div id="flightline-instructor">*/}
                            {/*<div href="#" id="flightline-instructor-name">*/}
                                {/*{Object.keys(this.state.flights).map(key => this.state.flights[key].employee_last_name)[7]}*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    </div>
                </button>
            )
        }
}
export default FlightlineFlight