import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import dateFormat from 'dateformat'
import UserPhoto from '../../components/UserPhoto'
var AWS = require('aws-sdk');



const CustomerDetailHeader =  (props) => {

    return (
        <div id="customer-detail-header">
            <div>
                <div id="customer-header-left">
                    <div id="customer-header-image">
                        <UserPhoto
                            picture_url={props.selectedCustomer.profile}
                            //picture_url={`http://s3.amazonaws.com/equipmenot/person${props.selectedCustomer.person_id}/profile`}
                            //picture_url={props.selectedCustomer.picture_url}
                            imageID="close-modal-customer-image"
                            thumbnailSize="user fa-5x"/>
                    </div>
                </div>
                <div id="customer-detail-header-right">
                    <h2 id="customer-detail-header-name">
                        {`${props.selectedCustomer.first_name} ${props.selectedCustomer.last_name}`}
                    </h2>
                    <br/>
                    <div id="customer-detail-header-date">
                        { `Customer since ${dateFormat(props.selectedCustomer.member_since, "mmmm yyyy") }` }
                    </div>
                    <div id="customer-detail-header-dispatch-group">
                        <button id="pin-flight-btn" onClick={ () => props.editCustomerDetail() } type="button" className="btn btn-primary">
                            Edit Customer
                        </button>
                        <Link to={{
                            pathname: `/modal/instructors/${props.selectedCustomer.person_id}`,
                            state: {modal: true}} }>
                            <button id="pin-flight-btn" type="button" className="btn btn-primary">
                                Certificates
                            </button>
                        </Link>
                        <Link to={{
                            pathname: `/modal/profile/documents/${props.selectedCustomer.person_id}`,
                            state: {modal: true}
                        } }><button id="pin-flight-btn" type="button" className="btn btn-primary">
                            Documents
                        </button>
                        </Link>
                    </div>
                </div>
            </div>
            <br/>
            <hr id="customer-detail-header-hr" />
            <br/>

        </div>
    )
};

CustomerDetailHeader.propTypes = {
    editCustomerDetail: PropTypes.func.isRequired,
    selectedCustomer: PropTypes.object.isRequired
};

CustomerDetailHeader.defaultProps = {
    selectedCustomer: ""
};

export default CustomerDetailHeader;