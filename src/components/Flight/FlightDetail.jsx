import React from 'react';
import { render } from 'react-dom';
import FlightDetailHeader from './FlightDetailHeader'
import FlightDetailInfo from './FlightDetailInfo'
import FlightDetailFlight from './FlightDetailFlight'


const FlightDetail = (props) =>  {

    return (
        <div id="flight-detail-container" className="container">
            <FlightDetailHeader
                selectedAircraft={props.selectedAircraft}
                editAircraftDetail={props.editAircraftDetail}/>
            {
                props.selectedFlight &&
                <FlightDetailInfo
                    selectedAircraft={props.selectedAircraft}
                    selectedFlight={props.selectedFlight}
                    editAircraftDetail={props.editAircraftDetail}
                    completedFlights={props.completedFlights}
                    pinnedFlights={props.pinnedFlights}
                    activeFlights={props.activeFlights}
                />
            }
        </div>
    )
};

export default FlightDetail