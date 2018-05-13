import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import ActiveFlight from './ActiveFlight'
import AircraftDetail from './FlightDetail'

// Active Aircraft Component


const ActiveFlights = (props) => {

    return (
        <div id="active-flight-list" className="">
            <label id="active-flights">ACTIVE FLIGHTS</label>
            <div className="container" id="active-flight-wrap">
                {
                    Object
                        .keys(props.aircraft)
                        .map(key => <ActiveFlight key={key}
                                                  activeAircraft={props.aircraft[key]}
                                                  renderAircraftDetail={props.renderAircraftDetail}/>)
                }

            </div>
        </div>
    )
};

ActiveFlights.propTypes = {
    aircraft: PropTypes.object
};


export default ActiveFlights