import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import CloseFlightAircraft from './CloseFlightAircraft'
import CloseFlightCustomer from './CloseFlightCustomer'
import { getFlight, getSquawks } from '../../actions/closeFlightActions'
import { connect } from 'react-redux'
import './closeflight.css'
import { server } from '../../helpers/serverAddress'


class CloseFlight extends React.Component {
    constructor() {
        super()
    }
    state = {
        flight: {},
        canEditCloseFlightModal: false,
        aircraft_id: '',
        squawks: {}
    };

    static propTypes = {
        flightId: PropTypes.string.isRequired,
        back: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.getFlight()
    }

    editCloseFlightModal = () => {
        this.setState({canEditCloseFlightModal: true})
    };

    getFlight = () => {
        this.setState({ flight: {} });
        this.props.getFlight(this.props.flightId)
            .then( (data) => {
                    // set state
                    this.setState({flight: data.data, aircraft_id: data.data.aircraft_id});
                    this.initSquawks(data.data.aircraft_id)
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    initSquawks = () => {
        // console.log(this.state.aircraft_id);
        this.props.getSquawks(this.state.aircraft_id)
            .then( (data) => {
                //map through the data array and send each result to addCustomer
                data.data.map((i) => {
                    //update with current state
                    const squawks = {...this.state.squawks};
                    //index squawk and add to the squawks array
                    squawks[`${i.squawk_id}`] = i;
                    //set state
                    this.setState({ squawks });
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    renderCloseFlightAircraft = (flight) => {
        this.setState({ flight: flight});
        this.setState({ canEditAircraftDetail: false })
    };

    render() {
        return (
            <div>
                <CloseFlightAircraft
                     reporterId={this.props.reporterId}
                     flightId={this.props.flightId}
                     flight={this.state.flight}
                     renderCloseFlightAircraft={this.renderCloseFlightAircraft}
                     squawks={this.state.squawks}
                />

                <CloseFlightCustomer
                     flight={this.state.flight}
                     back={this.props.back}
                />

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        reporterId: state.user.person_id
    }
};

export default connect(mapStateToProps, { getFlight, getSquawks })(CloseFlight);