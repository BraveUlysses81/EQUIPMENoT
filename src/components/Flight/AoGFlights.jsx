import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import AoGFlight from './AoGFlight'
import AircraftDetail from './FlightDetail'

// Active Flights Component

const AoGFlights = (props) => {

    return (
        <div id="aog-flight-list" className="">
            <label id="aog-flights">AIRCRAFT ON GROUND</label>
            <div className="container" id="aog-flight-wrap">
                {
                    Object
                        .keys(props.aircraft)
                        .map(key => <AoGFlight key={key}
                                               aogAircraft={props.aircraft[key]}
                                               renderAircraftDetail={props.renderAircraftDetail}/>)
                }
            </div>
        </div>
    )
};

AoGFlights.propTypes = {
    aircraft: PropTypes.object
};


export default AoGFlights

