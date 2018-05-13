import React from 'react'
import { render } from 'react-dom'
import axios from 'axios'
import FontAwesome from 'react-fontawesome'
import { server } from '../../helpers/serverAddress'

// Individual Flight Component

class AoGFlight extends React.Component {
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
        this.getFlights(this.props.aogAircraft)
    }

    getFlights(aogAircraft) {
        this.setState({ flights: "" })
        axios.get(`${server}/school/flights/1/${aogAircraft.registration_nbr}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }} )
            .then((data) => {
                data.data.map((i) => {
                    const flights = {...this.state.flights}
                    flights[`flights-${i.flight_id}`] = i
                    this.setState({ flights })
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    render () {
        return(

            <button type="button" onClick={ () => this.props.renderAircraftDetail( this.props.aogAircraft, this.state.flights ) }
                    id="flight-object" className="btn btn-default">

                <div id="flight-registration">
                    {this.props.aogAircraft.registration_nbr}
                </div>

                <div id="flight-hr-container">

                    <hr />
                </div>

                <div id="flightline-info" className="container">
                    <div id="aog-customer">
                        <div href="#" id="aog-customer-name">
                            {/*{this.props.aogAircraft.customer_last_name}*/}
                        </div>
                    </div>

                    <div id="aog-instructor">
                        <div href="#" id="aog-instructor-name">
                            {/*{this.props.aogAircraft.employee_last_name}*/}
                        </div>
                    </div>
                </div>

            </button>
        )
    }
}


export default AoGFlight;