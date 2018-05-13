import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import CustomerDetailHeader from './CustomerDetailHeader'
import CustomerDetailContact from './CustomerDetailContact'

class CustomerDetailContainer extends React.Component {
    constructor(){
        super()
    }

    static propTypes = {
        customerIsSelected: PropTypes.bool.isRequired,
        canEditCustomerDetail: PropTypes.bool.isRequired,
        selectedCustomer: PropTypes.object
    };

    renderCustomerDetail = () => {
        return (
            <div id="customer-detail-container" className="col-sm-7">

                <CustomerDetailHeader selectedCustomer={this.props.selectedCustomer}
                                      editCustomerDetail={this.props.editCustomerDetail}
                />

                <CustomerDetailContact selectedCustomer={this.props.selectedCustomer}
                                       canEditCustomerDetail={this.props.canEditCustomerDetail}
                                       updateCustomerDetails={this.props.updateCustomerDetails}
                />
            </div>
        )
    };

    render() {
        return (
            <div>
                {
                    /* check if a customer has been selected and render Customer Detail */
                    this.props.customerIsSelected &&
                    this.renderCustomerDetail()
                }
            </div>
        )
    }
}


export default CustomerDetailContainer;
