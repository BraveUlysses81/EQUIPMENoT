import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router-dom'
import FontAwesome from 'react-fontawesome'
import UserPhoto from '../UserPhoto'

class FlightDetailFlight extends React.Component {

    constructor() {
        super()
    }

    numberCheck = (flight) => {
        let digit = (flight.customer_mobile.length.toString()[0]);
        if (flight.customer_mobile.length == 11 && digit === "1")
        {
            return (flight.customer_mobile.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1-$2-$3-$4"))
        }
        else if (flight.customer_mobile.length == 10)
        {
            return (flight.customer_mobile.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"))
        }
        else
        {
            return (<div id="number-is-invalid">NUMBER IS INVALID</div>)
        }
    };

    isCompleted = () => {
        const isCompleted = this.props.flight.flight_status;

        if (isCompleted == 'completed')
        {
            return (
                <span id="flight-detail-pinned-customer-mobile">
                        <div id="close-flight-detail-alert">
                            {
                                <Link to={{
                                    pathname: `/modal/flights/${this.props.flight.flight_id}`,
                                    state: {modal: true}
                                } }>CLOSE FLIGHT!</Link>
                            }
                        </div>
                        <div id="close-flight-detail-mobile">
                        { this.numberCheck(this.props.flight) }
                        </div>
                </span>
            )
        }
        else
        {
            return (
                <span id="flight-detail-pinned-customer-mobile">
                    <div id="close-flight-detail-alert">

                            <Link id="flight-detail-link" to={{
                                pathname: `/modal/flightdetail/${this.props.flight.flight_id}`,
                                state: {modal: true}} }>
                                UPDATE FLIGHT
                            </Link>

                    </div>
                    <div id="close-flight-detail-mobile">
                        { this.numberCheck(this.props.flight) }
                    </div>
                </span>
            )
        }
    };

    employeeFirst = (flight) => {
        if (flight.employee_first_name == null) {
            return (
                'Solo '
            )
        } else {
            return (
                flight.employee_first_name
            )
        }
    };
    employeeLast = (flight) => {
        if (flight.employee_last_name == null) {
            return (
                ' '
            )
        } else {
            return (
                flight.employee_last_name
            )
        }
    };

    render() {
        return (
            <div>
                <ul id="flight-detail-list-group" className="list-group">
                    <div>
                        <li id="flight-detail-list-item" className="list-group-item">
                            <div id="flight-detail-pinned-info">
                                <UserPhoto picture_url={this.props.flight.customer_picture_url}  imageID="flight-detail-customer-image" thumbnailSize="user fa-3x"/>
                                <div id="flight-detail-pinned">
                        <span id="flight-detail-pinned-customer">
                            {
                                `${this.props.flight.customer_first_name} ${this.props.flight.customer_last_name}`
                            }
                        </span>
                                    <br/>

                                    <span id="flight-detail-pinned-employee">
                        {
                            `${this.employeeFirst(this.props.flight)} ${this.employeeLast(this.props.flight)}`
                        }
                        </span>
                                </div>

                                <div id="flight-detail-pinned-mobile" className="pull-right">
                                    {
                                        this.isCompleted()
                                    }
                                </div>

                            </div>
                        </li>
                    </div>
                </ul>
            </div>
        )
    }
}

export default FlightDetailFlight