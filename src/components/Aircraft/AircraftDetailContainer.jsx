
import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import AircraftDetailHeader from './AircraftDetailHeader'
import AircraftDetailContact from './AircraftDetailContact'

class AircraftDetailContainer extends React.Component {
    constructor(){
        super()
    }

    static propTypes = {
        aircraftIsSelected: PropTypes.bool.isRequired,
        canEditAircraftDetail: PropTypes.bool.isRequired,
        selectedAircraft: PropTypes.object,
        handleDetailsChange: PropTypes.func.isRequired,
        handleDetailsSubmit: PropTypes.func.isRequired,
        errors: PropTypes.object
    };

    renderAircraftDetail = () => {
        return (
            <div id="customer-detail-container" className="col-sm-7">

                <AircraftDetailHeader selectedAircraft={this.props.selectedAircraft}
                                      editAircraftDetail={this.props.editAircraftDetail}
                />

                <AircraftDetailContact selectedAircraft={this.props.selectedAircraft}
                                       canEditAircraftDetail={this.props.canEditAircraftDetail}
                                       handleDetailsChange={this.props.handleDetailsChange}
                                       handleDetailsSubmit={this.props.handleDetailsSubmit}
                                       errors={this.props.errors}
                />
            </div>
        )
    };

    render() {
        return (
            <div>
                {
                    /* check if a aircraft has been selected and render Aircraft Detail */
                    this.props.aircraftIsSelected &&
                    this.renderAircraftDetail()
                }
            </div>
        )
    }
}


export default AircraftDetailContainer;