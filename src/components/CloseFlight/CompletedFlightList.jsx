import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import dateFormat from 'dateformat';

class CompletedFlightList extends Component {
    formatDates = (date) => {
        if(date){
            return (dateFormat(date, 'mediumDate'))
        } else {
            return('')
        }
    };
    render() {
        const { flight_id, registration_nbr, dispatch_time, flight_type, customer_first, customer_last, instructor_first, instructor_last } = this.props.completeFlight
        return (
            <tr key={this.props.flight_id}>
                <td>{flight_id}</td>
                <td>{registration_nbr}</td>
                <td>{this.formatDates(dispatch_time)}</td>
                <td>{flight_type}</td>
                <td>{customer_first}</td>
                <td>{customer_last}</td>
                <td>{instructor_first}</td>
                <td>{instructor_last}</td>
                <td>
                    <Link to={{
                        pathname: `/modal/flights/${flight_id}`,
                        state: {modal: true}
                    } }>Close Flight</Link>
                </td>
            </tr>
        )
    }
}

export default CompletedFlightList;