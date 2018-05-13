import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import CloseFlightAircraftPhoto from '../CloseFlight/CloseFlightAircraftPhoto'
import { newSquawk } from '../../actions/closeFlightActions'
import SquawkList from '../../components/CloseFlight/SquawkList'
import { connect } from 'react-redux'

class FlightDetailAircraft extends React.Component {

    constructor(props){
        super(props)
    }
    state = {
        canEditFlight: false,
        selectedSquawk: {},
        squawkIsSelected: false,
        canEditSquawkDetail: false
    };
    static propTypes = {
        flight: PropTypes.object.isRequired,
        squawks: PropTypes.object
    };

    selectSquawk = (selectedSquawk) => {
        // set squawkIsSelected to true so CustomerDetailContainer is rendered and reset canEditCustomerDetail
        this.setState({ selectedSquawk, squawkIsSelected: true, canEditSquawkDetail: false})
        //this.context.router.history.push(`/customers/${selectedCustomer.person_id}`)
    };

    render(){
        const flight = this.props.flight;
        const aircraftImage = this.props.flight.aircraft_picture_url;
        return(
            <div id="close-flight-aircraft">
                <div id="close-modal-flight-image">
                    <CloseFlightAircraftPhoto picture_url={this.props.flight.aircraft_picture_url}
                                                      imageID="close-modal-aircraft-image"
                                                        // id="close-flight-aircraft-default-image"
                                                      thumbnailSize="plane fa-5x"/>
                </div>

                    <br/>
                    <br/>

                <div id="close-modal-aircraft-text">

                    <span id="close-modal-registration-text">
                        {this.props.flight.registration_nbr}
                    </span>

                        <br/>

                        <span id="close-modal-make-model-text">
                            {`${this.props.flight.make} `}
                            {`${this.props.flight.model_id} `}
                            {`${this.props.flight.popular_name} `}
                        </span>

                        <br/>
                        <br/>

                    <div>
                        {
                            this.props.squawks && (<SquawkList squawks={this.props.squawks}
                                                               selectSquawk={this.selectSquawk}/>)
                        }
                    </div>

                    <br/>

                    <div id="postflight-squawk-add">
                        <input
                            type="text"
                            name="addSquawk"
                            id="postflight-squawk-add-input"
                            required placeholder=" Add Maintenance Item"
                        />

                        <br/>
                        <br/>

                        <button id="pilot-certificate-new-btn"
                                type="submit"
                                className="btn btn-default"
                                // readOnly={!this.state.canEditFlight}
                                onClick={(e) => this.addNewSquawk(e)}
                        >
                            Submit
                        </button>

                    </div>

                </div>
                <br/>

            </div>
        )
    }
}

export default connect(null, { newSquawk })(FlightDetailAircraft);
// export default FlightDetailAircraft;