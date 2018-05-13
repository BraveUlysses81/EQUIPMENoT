import React from 'react'
import { render } from 'react-dom'
import FlightlineFlight from './FlightlineFlight'
import PropTypes from 'prop-types'
import AircraftDetail from './FlightDetail'

// Flightline Aircraft Component

const FlightlineFlights = (props) => {

    return (
        <div id="flightline-flight-list" className="">
            <label id="flightline-flights">FLIGHT LINE</label>
            <div className="container" id="flightline-flight-wrap">
                {
                    Object
                        .keys(props.aircraft)
                        .map(key => <FlightlineFlight key={key}
                                                      flightlineAircraft={props.aircraft[key]}
                                                      renderAircraftDetail={props.renderAircraftDetail}/>)
                }
            </div>
        </div>
    )
};

FlightlineFlights.propTypes = {
    aircraft: PropTypes.object
};


export default FlightlineFlights