
import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'

// Individual Customer Component

class CustomerCurrency extends React.Component {
    // set initial states
    state = {
        currencyDaysLeft: "",
        currencyFontColor: '#000000'
    };

    constructor() {
        super();
    }

    static propTypes = {
        checkout: PropTypes.object.isRequired
    };

    componentWillMount() {
        let currentDate = new Date();  // get current date
        let endDate = new Date(this.props.checkout.currency_end_date);  //convert currency end date to date
        let currencyDaysLeft = Math.round((endDate - currentDate) / (1000 * 60 * 60 * 24)); //subtract and convert to days
        if (currencyDaysLeft < 1) {    // if currencyDaysLeft exists and is less than zero and set to currency to 0
            currencyDaysLeft = 0; //only display 0 and not a negative number
            this.setState({currencyFontColor: '#ff0000'}) //set font color to red
        }
        this.setState({currencyDaysLeft})
    }

    render () {
        return(
            <div id="customer-currency-item" className="row">
                <div className="col-sm-3 col-xs-3" id="currencyDaysLeft" style={{color: this.state.currencyFontColor}} >
                    {`${this.state.currencyDaysLeft} days`}
                </div>
                <div className="col-sm-4 col-xs-4" id="currencyRegNbr" style={{color: this.state.currencyFontColor}} >
                    {this.props.checkout.registration_nbr}
                </div>
                <div className="col-sm-2 col-xs-2">
                    {
                        this.props.checkout.glass_cockpit &&
                        <div id="currencyGlassCockpit">
                            <FontAwesome name="window-maximize"/>
                            <span id="currency-option-text">  GLASS COCKPIT</span>
                        </div>
                    }
                </div>
                <div className="col-sm-2 col-xs-2">
                    {
                        this.props.checkout.ifr_checkout &&
                            <div id="currencyIfrCheckout">
                                <FontAwesome name="dashboard"/>
                                <span id="currency-option-text">  IFR CHECKOUT</span>
                        </div>
                    }
                </div>
            </div>
        )
    }
}



export default CustomerCurrency;