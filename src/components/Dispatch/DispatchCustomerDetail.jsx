import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import UserPhoto from '../../components/UserPhoto'
import FontAwesome from 'react-fontawesome'
import CloseFlightUserPhoto from '../CloseFlight/CloseFlightUserPhoto'


class DispatchCustomerDetail extends React.Component {
    state = {

    };

    constructor(){
        super()
    }

    static propTypes = {
        selectedDispatchCustomer: PropTypes.object.isRequired,
        override: PropTypes.bool,
        resetState: PropTypes.func,

    };

    numberCheck = () => {
        let digit = (this.props.selectedDispatchCustomer.mobile.length.toString()[0]);
        if (this.props.selectedDispatchCustomer.mobile.length == 11 && digit === "1")
        {
            return (this.props.selectedDispatchCustomer.mobile.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1-$2-$3-$4"))
        }
        else if (this.props.selectedDispatchCustomer.mobile.length == 10)
        {
            return (this.props.selectedDispatchCustomer.mobile.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"))
        }
        else
        {
            return ("NUMBER IS INVALID")
        }
    };



    componentWillMount() {
    }



    render() {
        return (
            <div id="dispatch-customer">

                    <div id="dispatch-customer-header-left">
                        <div id="close-flight-customer-header-image">
                            <CloseFlightUserPhoto
                                picture_url={this.props.selectedDispatchCustomer.picture_url}
                                imageID="close-modal-customer-image"
                                thumbnailSize="user fa-5x"/>
                        </div>
                    </div>

                <br/>
                <div id="dispatch-customer-info-container">
                    <div id="dispatch-customer-info-header">
                    <h2 id="dispatch-customer-name">
                        {`${this.props.selectedDispatchCustomer.first_name} ${this.props.selectedDispatchCustomer.last_name}`}
                    </h2>

                        <br/>
                        <div id="dispatch-customer-mobile">
                            <FontAwesome name="mobile fa-2x" id="mobilePhone"/>
                            <div id="dispatch-customer-mobile-text">
                                { this.numberCheck() }
                            </div>
                        </div>
                        <br/>
                        <div id="dispatch-customer-address">
                            <FontAwesome name="home fa-2x" id="homeIcon"/>
                            <div id="dispatch-customer-address-text">
                                {`${this.props.selectedDispatchCustomer.address + ', '}`}
                                {`${this.props.selectedDispatchCustomer.city + ' '}
                                ${this.props.selectedDispatchCustomer.state}
                                ${this.props.selectedDispatchCustomer.zip}`}
                            </div>
                        </div>

                        <button id="dispatch-customer-override-btn"
                                className="btn btn-danger pull-right"
                                name="override"
                                onClick={this.props.flightOverride}
                        >
                            OVERRIDE
                        </button>
                        <button id="dispatch-customer-reset-btn"
                                className="btn btn-warning pull-left"
                                name="reset"
                                onClick={this.props.resetState}
                        >
                            RESET
                        </button>
                </div>
                </div>
                <br/>
                <hr id="close-flight-hr"/>

            </div>
        )
    }
}



export default DispatchCustomerDetail;