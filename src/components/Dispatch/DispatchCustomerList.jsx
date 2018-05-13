import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import UserPhoto from '../../components/UserPhoto'
import FontAwesome from 'react-fontawesome'



class DispatchCustomerList extends React.Component {
    constructor() {
        super()
    }

    static propTypes = {
        dispatchCustomers: PropTypes.object
    }

    numberCheck = (dispatchCustomer) => {
        let digit = (dispatchCustomer.mobile.length.toString()[0]);
        if (dispatchCustomer.mobile.length == 11 && digit === "1")
        {
            return (dispatchCustomer.mobile.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1-$2-$3-$4"))
        }
        else if (dispatchCustomer.mobile.length == 10)
        {
            return (dispatchCustomer.mobile.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"))
        }
        else
        {
            return ("NUMBER IS INVALID")
        }
    };

    renderDispatchCustomer = (key) => {

        const dispatchCustomer = this.props.dispatchCustomers[key]

        return(
            <div key={key}>
                <li id="customer-list-group" className="list-group-item">
                    <button id="customer-list-button" onClick={ () => {this.props.selectDispatchCustomer(dispatchCustomer) } } style={{ color: 'lightgray' }}>
                        <div id="customer-list-image-wrap">
                            <div id="customer-image" >
                                <UserPhoto picture_url={dispatchCustomer.picture_url} imageID="list-photo" thumbnailSize="user fa-2x"/>
                            </div>

                        </div>
                        <br/>
                        <div id="customer-list-info">
                            <div id="customer-list-name">
                                {
                                 ' ' +  dispatchCustomer.first_name + ' ' + dispatchCustomer.last_name
                                }
                            </div>
                            <div id="customer-list-contact-mobile">

                                <FontAwesome name="mobile" id="mobile-phone-tiny"/>
                                <span id="customer-list-contact-mobile-number">
                                    { ' ' + this.numberCheck(dispatchCustomer) }
                                </span>

                            </div>
                        </div>
                    </button>
                </li>

            </div>
        )
    };

    render() {
        return (
            <div id="dispatch-customer-list" className="col-sm-4">
                <label id="customer-list-header">CUSTOMERS</label>
                <ul className="list-group">
                    {
                        Object.keys(this.props.dispatchCustomers).map(this.renderDispatchCustomer)
                    }
                </ul>
            </div>
        )
    }
}

export default DispatchCustomerList;