import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import InstructorDetailHeader from './InstructorDetailHeader'
import InstructorDetailContact from './InstructorDetailContact'

class InstructorDetail extends React.Component {
    constructor(){
        super()
    }

    static propTypes = {
        instructorIsSelected: PropTypes.bool.isRequired,
        canEditInstructorDetail: PropTypes.bool.isRequired,
        selectedInstructor: PropTypes.object
    };

    renderInstructorDetail = () => {
        return (
            <div id="customer-detail-container" className="col-sm-7">

                <InstructorDetailHeader selectedInstructor={this.props.selectedInstructor}
                                        editInstructorDetail={this.props.editInstructorDetail}
                />

                <InstructorDetailContact selectedInstructor={this.props.selectedInstructor}
                                         canEditInstructorDetail={this.props.canEditInstructorDetail}
                                         updateInstructorDetails={this.props.updateInstructorDetails}
                />
            </div>
        )
    };

    render() {
        return (
            <div>
                {
                    /* check if a customer has been selected and render Customer Detail */
                    this.props.instructorIsSelected &&
                    this.renderInstructorDetail()
                }
            </div>
        )
    }
}

export default InstructorDetail;