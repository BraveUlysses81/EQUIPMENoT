import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import FlightModalDetailContainer from './FlightModalDetailContainer'
import './flightmodaldetail.css'
import { connect } from 'react-redux'
import dateFormat from 'dateformat'
import { server } from '../../helpers/serverAddress'
import { getFlight, getSquawks } from '../../actions/closeFlightActions'


class FlightModalDetail extends React.Component {
    state = {
        flight: {},
        squawks: {},
        aircraft_id: '',
        canEditFlightDetailModal: false
    };

    constructor(){
        super()
    }

    static propTypes = {
        flightId: PropTypes.string.isRequired
        // back: PropTypes.func.isRequired
    };

    editFlightDetailModal = () => {
        this.setState({canEditFlightDetailModal: true})
    };

    getFlight = () =>{
        axios.get(`${server}/flight/detail/${this.props.flightId}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }})
            .then( (data) => {
                const flight = data.data;
                this.setState({ flight });
                this.initSquawks(data.data.aircraft_id)
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    initSquawks = () => {
        console.log(this.state.aircraft_id);
        this.props.getSquawks(this.state.flight.aircraft_id)
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

    componentWillMount = () =>{
        this.getFlight()
    };

    render(){
        return(
            <div>
                <FlightModalDetailContainer flight={this.state.flight}
                                            getFlight={this.getFlight}
                                            squawks={this.state.squawks}
                                            reporterId={this.props.reporterId}
                                            dispatcherId={this.props.dispatcherId}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        dispatcherId: state.user.person_id,
        reporterId: state.user.person_id
    }
};


export default connect(mapStateToProps, {getSquawks})(FlightModalDetail)


