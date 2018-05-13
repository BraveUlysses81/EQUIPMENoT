import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import dateFormat from 'dateformat'
import UserPhoto from '../../components/UserPhoto'
import { Link } from 'react-router-dom'


const InstructorDetailHeader =  (props) => {
    const { selectedInstructor } = props;

    return (
        <div id="customer-detail-header">
            <div>
                <div id="customer-header-left">
                    <div id="customer-header-image">
                        <UserPhoto
                            picture_url={selectedInstructor.profile}
                            imageID="close-modal-customer-image"
                            thumbnailSize="user fa-5x"/>
                    </div>
                </div>
                <div id="customer-detail-header-right">
                    <h2 id="customer-detail-header-name">
                        {`${selectedInstructor.first_name} ${selectedInstructor.last_name}`}
                    </h2>
                    <br/>
                    <div id="customer-detail-header-date">
                        { `Member since ${dateFormat(selectedInstructor.member_since, "mmmm yyyy") }` }
                    </div>
                    <div id="customer-detail-header-dispatch-group">
                        <button id="pin-flight-btn" type="button" className="btn btn-primary" onClick={ () => props.editInstructorDetail() }>
                            Edit Instructor
                        </button>
                        <Link to={{
                            pathname: `/modal/instructors/${selectedInstructor.person_id}`,
                            state: {modal: true}} }>
                            <button id="pin-flight-btn" type="button" className="btn btn-primary">
                                Certificates
                            </button>
                        </Link>
                        <Link to={{
                            pathname: `/modal/profile/documents/${selectedInstructor.person_id}`,
                            state: {modal: true}
                        } }><button id="pin-flight-btn" type="button" className="btn btn-primary">
                            Documents
                        </button>
                        </Link>
                    </div>

                </div>
            </div>

                <hr id="customer-detail-header-hr" />
            <br/>
        </div>
    )
};

InstructorDetailHeader.propTypes = {
    editInstructorDetail: PropTypes.func.isRequired,
    selectedInstructor: PropTypes.object.isRequired
};

InstructorDetailHeader.defaultProps = {
    selectedInstructor: ""
};

export default InstructorDetailHeader;