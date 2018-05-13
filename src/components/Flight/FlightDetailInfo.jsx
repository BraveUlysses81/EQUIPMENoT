import React from 'react'
import { render } from 'react-dom'
import FontAwesome from 'react-fontawesome'
import PropTypes from 'prop-types'
import FlightDetailFlight from './FlightDetailFlight'

class FlightDetailInfo extends React.Component {

    constructor () {
        super();
    }

    static propTypes = {
        selectedFlight: PropTypes.object,
        pinnedFlights: PropTypes.object,
        completedFlights: PropTypes.object,
        activeFlights: PropTypes.object
    }

    renderActiveFlights = (key) => {
        return (
            <div key={key} id="flight-detail-info-active" className="row">

                <FlightDetailFlight
                    flight={this.props.activeFlights[key]}
                    selectedAircraft={this.props.selectedAircraft}
                    selectedFlight={this.props.selectedFlight}/>
            </div>
        )
    }

    renderCompletedFlights = (key) => {
           return(
               <div key={key} id="flight-detail-info" className="row">

                       <FlightDetailFlight
                           flight={this.props.completedFlights[key]}
                           selectedAircraft={this.props.selectedAircraft}
                           selectedFlight={this.props.selectedFlight}/>
               </div>
           )
    }

    renderPinnedFlights = (key) => {
           return (
               <div key={key} id="flight-detail-info" className="row">

                   <FlightDetailFlight
                       flight={this.props.pinnedFlights[key]}
                       selectedAircraft={this.props.selectedAircraft}
                       selectedFlight={this.props.selectedFlight}/>
               </div>
           )
    }


    render () {
        // Maps through the flights object
        return(
            <div>
                {
                    Object.keys(this.props.activeFlights).length !== 0 ? (<span id="flight-detail-active-text">ACTIVE</span>) : (<div></div>)
                }
                {
                    Object.keys(this.props.activeFlights).map(this.renderActiveFlights)
                }
                {
                    Object.keys(this.props.activeFlights).length !== 0 ? (<hr id="flight-detail-status-hr"/>) : (<div></div>)
                }
                <br/>
                {
                    Object.keys(this.props.pinnedFlights).length !== 0 ?  (<span id="flight-detail-flights-text">PENDING FLIGHTS</span>) : (<div></div>)
                }
                {
                    Object.keys(this.props.pinnedFlights).map(this.renderPinnedFlights)
                }
                {
                    Object.keys(this.props.pinnedFlights).length !== 0 ? (<hr id="flight-detail-divide-hr"/>) : (<div></div>)
                }
                <br/>
                {
                    Object.keys(this.props.completedFlights).length !== 0 ? (<span id="flight-detail-flights-text">COMPLETED FLIGHTS</span>) : (<div></div>)
                }
                {
                    Object.keys(this.props.completedFlights).map(this.renderCompletedFlights)
                }
            </div>
        )
    }
}

export default FlightDetailInfo

