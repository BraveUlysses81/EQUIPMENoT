import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import AircraftPhoto from '../AircraftPhoto'


class FlightDetailHeader extends React.Component {
    // set state
    state = {
        selectedAircraft: {},
        statusText: {}
    };
    constructor () {
        super();
    }

    // receive props and update state
    componentWillReceiveProps (nextProps) {
        if (this.props.selectedAircraft != nextProps.aircraft) {
            const selectedAircraft = nextProps.aircraft
            this.setState({selectedAircraft: selectedAircraft})
        }
    }

    aircraftStatusCheck = (status) => {
        if (status === "active")
        {
            return ("ACTIVE")
        }
        else if (status === "flight_line")
        {
            return ("FLIGHT LINE")
        }
        else
        {
            return ("GROUNDED")
        }
    };

    render () {

        let aircraftImage = this.props.selectedAircraft.picture_url;

        return (

            <div id="flight-detail-header" className="row">
                <div id="flight-detail-image">
                    <AircraftPhoto picture_url={aircraftImage}  imageID="flight-detail-aircraft-image" thumbnailSize="plane fa-5x"/>
                    {/*<img src={ aircraftImage } />*/}
                </div>

                <br/>

                <div id="detail-header-text">

                    <span id="registration-text">
                        {`${this.props.selectedAircraft.registration_nbr}`}
                    </span>

                    <span id="flight-status-text" className="pull-right">{this.aircraftStatusCheck(this.props.selectedAircraft.aircraft_status)}</span>

                    <br/>
                    
                    <div id="flight-status-icons">
                        <div id="depart-hobbs" className="col-md-4"><FontAwesome name="clock-o fa-2x" style={{ fontSize: '1.7em' }}/><span id="depart-hobbs-text"> {`${ this.props.selectedAircraft.hobbs }`} </span><span id="hobbs-tooltip">HOBBS</span></div>
                        <div id="tach-time" className="col-md-4"><FontAwesome name="tachometer fa-2x" style={{ fontSize: '1.7em' }}/><span id="tach-time-text"> {`${ this.props.selectedAircraft.tach}`} </span><span id="tach-tooltip">TACH</span></div>
                        <div id="hours-to-maint" className="col-md-4"><FontAwesome name="wrench fa-2x" style={{ fontSize: '1.7em' }}/><span id="hours-to-maint-text"> {`${ this.props.selectedAircraft.hundred_hr_inspection}`} </span><span id="hours-to-maint-tooltip">100 HOUR INSPECTION</span></div>
                    </div>

                    <br/>
                    <br/>
                    <br/>
                    <hr id="flight-detail-status-hr"/>
                </div>

            </div>
        )
    }
}

FlightDetailHeader.defaultProps = {
    selectedAircraft: ""
};

export default FlightDetailHeader

