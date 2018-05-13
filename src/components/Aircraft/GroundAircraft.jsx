import React from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { getAllAircraft, updateAircraftStatus, getDispatchedFlights } from '../../actions/aircraftActions'
import AircraftSelectInput from './AircraftSelectInput'
import { Modal, Button } from 'react-bootstrap'


class GroundAircraft extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        registration_nbr: '',
        aircraft: {},
        dispatchedFlights: {},
        errors: '',
        aircraft_status: 'active',
        flightsToCancel: {},
        isFetching: ''
    };

    componentWillMount() {
        this.getAircraft()
    };

    getAircraft = () => {
        this.props.getAllAircraft(this.props.school_id)
            .then((data) => {
                Object.keys(data.data).map(key => {
                    const aircraft = {...this.state.aircraft};
                    aircraft[key] = data.data[key];
                    this.setState({ aircraft });
                })
            })
            .catch( (err) => {
                console.log(err)
            })
    };

    setAircraftStatus = (value) => {
        const { aircraft } = this.state;

        Object.keys(aircraft).map((key) => {
            if(aircraft[key].registration_nbr === value) {
                //set aircraft status for selected registration number
                this.setState({ aircraft_status: aircraft[key].aircraft_status });

                //get dispatched flights if aircraft is in flight_line
                if(aircraft[key].aircraft_status !== 'active') {
                    this.setState({ dispatchedFlights: {} });
                    this.props.getDispatchedFlights(this.props.school_id, aircraft[key].registration_nbr)
                        .then((data) => {
                            data.data.map((i) => {
                                const dispatchedFlights = {...this.state.dispatchedFlights};
                                dispatchedFlights[`flight-${i.flight_id}`] = i;
                                this.setState({ dispatchedFlights });
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            }
        })
    };

    onChange = (e) => {

        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        if(target.name === 'registration_nbr') {
            //clear aircraft status
            this.setState({ aircraft_status: ''});

            this.setAircraftStatus(value)
        }
        if(target.name.includes('dispatchedFlights')){
            const fields = target.name.split('-');
            const flight_id = fields[2];
            let flightsToCancel = {...this.state.flightsToCancel};

            if(value){
                //if value is true add to the cancel flight object
                flightsToCancel[`flight-${flight_id}`] = flight_id;
                this.setState({ flightsToCancel });
            } else {
                //if value is false remove from cancel flight object
                delete flightsToCancel[`flight-${flight_id}`];
                this.setState({ flightsToCancel });
            }
        } else {
            this.setState({[target.name]: value})
        }
    };

    onSubmit = (e) => {
        e.preventDefault();

        this.props.updateAircraftStatus(this.state.registration_nbr, this.state.aircraft_status, this.state.flightsToCancel)
            .then(() => {
                this.props.history.goBack()
            })
            .catch((err) => {
                if(err.response) {
                    this.setState({ errors: {form: err.response.data}})
                }else {
                    this.setState({ errors: {form: 'Oops! Something went wrong.'}})
                }
            })
    };

    handleCancel = (e) => {
        e.stopPropagation();
        this.props.history.goBack()
    };

    render() {
        const { registration_nbr, errors, aircraft,  aircraft_status, dispatchedFlights } = this.state;

        const aircraftArray = Object.keys(aircraft)
            .map(key => <option key={key} > {aircraft[key].registration_nbr}</option>);

        const dispatchedFlightsArray = Object.keys(dispatchedFlights).map(key =>
                <tr key={key}>
                    <td><input type="checkbox" name={`dispatchedFlights-${key}`} value='dispatchedFlights' onChange={this.onChange} /> </td>
                    <td>{dispatchedFlights[key].flight_id}</td>
                    <td>{`${dispatchedFlights[key].customer_first_name} ${dispatchedFlights[key].customer_last_name}`}</td>
                    <td>{`${dispatchedFlights[key].instructor_first_name} ${dispatchedFlights[key].instructor_last_name}`}</td>
                </tr>);

        const activeFlight = (
                <div>
                    <p>
                        {registration_nbr ? `Current Status: ${aircraft_status}` : null }
                    </p>
                </div>
        );

        const nonActiveFlight = (
                <div className={ classnames("form-group", {'has-error': errors.aircraft_status})} >
                        <label id="aircraft-add-make" className="control-label">Change Status To:</label>
                        <select
                            name='aircraft_status'
                            value={aircraft_status}
                            onChange={this.onChange}
                            className="form-control"
                        >
                            <option value='Change status' disabled>

                            </option>
                            <option value='flight_line'>Flight Line</option>
                            <option value='grounded'>Grounded</option>

                        </select>
                        {
                            Object.keys(dispatchedFlights).length !== 0 ? (
                                <div id="ground-aircraft-pinned">
                                    <h5 id="ground-aircraft-pinned-header">Dispatched Flights</h5>
                                    <p>* Check Cancel Flight to cancel when changes are saved</p>
                                    <table className="table table-stripped">
                                        <thead>
                                            <tr>
                                                <th>Cancel Flight</th>
                                                <th>Flight ID</th>
                                                <th>Customer Name</th>
                                                <th>Instructor Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                dispatchedFlightsArray
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            ) : null
                        }

                        {
                            errors.aircraft_status ?
                                (<span id="textfieldgroup-error" className="help-block">{errors.aircraft_status}</span>)
                                : (<span id="textfieldgroup-error-none">{errors.aircraft_status}</span>)
                        }
                </div>
        );

        return(
            <div>
                <Modal show={true}>
                    <Modal.Header>
                        <Modal.Title id="modal-title">Ground Aircraft</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        { errors.form && <div className="alert alert-danger">{errors.form}</div> }
                    <AircraftSelectInput
                        label="Registration Number"
                        field="registration_nbr"
                        onChange={this.onChange}
                        value={registration_nbr}
                        error={errors.make}
                        displayArray={aircraftArray}
                        defaultOption="Choose the Aircraft Registration Number"
                    />
                        {
                            aircraft_status === 'active' ? activeFlight : nonActiveFlight
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" className="btn btn-primary" onClick={this.onSubmit} >
                            Save Changes
                        </Button>
                        <Button onClick={this.handleCancel}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    school_id: state.member.school_id
});

export default connect(mapStateToProps, { getAllAircraft, updateAircraftStatus, getDispatchedFlights })(GroundAircraft);