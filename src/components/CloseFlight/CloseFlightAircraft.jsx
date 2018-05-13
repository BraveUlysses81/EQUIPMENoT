import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import dateFormat from 'dateformat'
import CloseFlightAircraftPhoto from './CloseFlightAircraftPhoto'
import { newSquawk } from '../../actions/closeFlightActions'
import SquawkList from './SquawkList'
import { connect } from 'react-redux'
import axios from 'axios'

class CloseFlightAircraft extends React.Component {

    constructor(props) {
        super(props)
    }
    state = {
        aircraftId: '',
        canEditFlight: false,
        selectedSquawk: {},
        squawkIsSelected: false,
        canEditSquawkDetail: false
    };
    static propTypes = {
        reporterId: PropTypes.number,
        flight: PropTypes.object.isRequired,
        squawks: PropTypes.object,
        newSquawk: PropTypes.func.isRequired,
        renderCloseFlightAircraft: PropTypes.func.isRequired
    };

    addNewSquawk = (e) => {
        e.preventDefault();
        this.props.newSquawk(this.props.reporterId, this.state.aircraft_id)

            .then( (response) => {
                const aircraftId = response.data[0].aircraft_id;
                this.setState({aircraftId: aircraftId})
                // console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    // isSquawk = (flight) => {
    //     // let isSquawk = Object.keys(this.state.flight).map(key => this.state.flight[key].entry_date)
    //     if ( flight.entry_date == null ) {
    //         return ( '' )
    //     }
    //     else return (dateFormat (this.props.flight.entry_date, "fullDate"))
    // };

    selectSquawk = (selectedSquawk) => {
        // set squawkIsSelected to true so CustomerDetailContainer is rendered and reset canEditCustomerDetail
        this.setState({ selectedSquawk, squawkIsSelected: true, canEditSquawkDetail: false})
        //this.context.router.history.push(`/customers/${selectedCustomer.person_id}`)
    };

    // onChange = (e) => {
    //     this.setState({ [e.target.name]: e.target.value })
    // };

    // handleChangeSquawk = (e) => {
    //     let name = e.target.name;
    //     let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    //     this.setState({ [name]: value })
    // };

    render = () => {

        const flight = this.props.flight;
        const aircraftImage = this.props.flight.aircraft_picture_url;

        return (
            <div id="close-flight-aircraft">
                <div id="close-modal-flight-image">
                    <CloseFlightAircraftPhoto picture_url={aircraftImage}
                                              imageID="close-modal-aircraft-image"
                                                // id="close-flight-aircraft-default-image"
                                              thumbnailSize="plane fa-5x"/>
                </div>

                <br/>
                <br/>

                <div id="close-modal-aircraft-text">

                    <span id="close-modal-registration-text">
                        {flight.registration_nbr}
                    </span>

                    <br/>

                    <span id="close-modal-make-model-text">
                        {`${flight.make} `}
                        {`${flight.model_id} `}
                        {`${flight.popular_name} `}
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

                    <form>
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
                    </form>

                </div>
                <br/>

            </div>
        )
    }
}

export default connect(null, { newSquawk })(CloseFlightAircraft);