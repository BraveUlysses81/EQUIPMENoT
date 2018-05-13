// EQUIP.ME.NoT Instructor Desk

import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import InstructorList from './InstructorList'
import InstructorDetail from './InstructorDetail'
import './instructor.css'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap'
import getProfileImage from '../../helpers/getProfileImage';
import { updateInstructor, getAllInstructors } from '../../actions/instructorActions'

import axios from 'axios'
import { server } from '../../helpers/serverAddress'

// Instructor Desk

class InstructorDesk extends React.Component {
    state = {
        instructors: {},
        selectedInstructor: {},
        instructorIsSelected: false,
        canEditInstructorDetail: false
    };

    constructor(props) {
        super(props);
    }

    static propTypes = {
        getAllInstructors: PropTypes.func.isRequired,
        updateInstructor: PropTypes.func.isRequired,
        schoolId: PropTypes.number.isRequired,
    }

    componentWillMount() {
        //check if the last instructor is in session storage
        const sessionStorageInstructor = sessionStorage.getItem('lastSelectedInstructor');

        if(this.props.location.state && this.props.location.state.id) {
            this.handleSearchRequest(this.props.location.state.id)
        } else if(sessionStorageInstructor) {
            this.selectInstructor(JSON.parse(sessionStorageInstructor))
        }
    }

    componentDidMount() {
        //load the instructor List
        this.getInstructors()
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.location.state) {
            const nextSearchId = nextProps.location.state.id;

            if (nextSearchId) {
                this.handleSearchRequest(nextSearchId)
            }
        }

        if (Object.keys(nextState.selectedInstructor).length !== 0) {
            sessionStorage.setItem('lastSelectedInstructor', JSON.stringify(nextState.selectedInstructor))

        }
    }

    replaceInstructorNullFields = (instructor) => {

        instructor.address = instructor.address || '';
        instructor.city = instructor.city || '';
        instructor.state = instructor.state || '';
        instructor.zip = instructor.zip || '';
        instructor.email = instructor.email || '';
        instructor.phone = instructor.phone || '';
        instructor.mobile = instructor.mobile || '';
        //instructor.dob = instructor.dob || '';
        instructor.emergency_first_name = instructor.emergency_first_name || '';
        instructor.emergency_last_name = instructor.emergency_last_name || '';
        instructor.emergency_phone = instructor.emergency_phone || '';
        return instructor;
    };

    handleSearchRequest = (searchId) => {
        const {instructors} = this.state

        // map through customers object to match searchId
        Object.keys(instructors).some(key => {
            if (key === searchId) {
                this.selectInstructor(instructors[key]);
            }
        })
    };

    //Call to school/1/instructors route and update customers state
    getInstructors = () => {
        this.props.getAllInstructors(this.props.schoolId)
            .then( (data) => {
                //map through the data array and send each result to addInstructor
                data.data.map((i) => {
                    //get instructor profile image
                    i.profile = getProfileImage(i);
                    //update with current state
                    const instructors = {...this.state.instructors};
                    //index instructors and add to the instructors array
                    instructors[`${i.person_id}`] = this.replaceInstructorNullFields(i);
                    //set state
                    this.setState({instructors})
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    selectInstructor = (selectedInstructor) => {
        // set instructorIsSelected to true so InstructorDetailContainer is rendered and reset canEditInstructorDetail
        this.setState({ selectedInstructor: selectedInstructor, instructorIsSelected: true, canEditInstructorDetail: false})
        this.context.router.history.push(`/instructors/${selectedInstructor.person_id}`)
    };

    editInstructorDetail = () => {
        this.setState({ canEditInstructorDetail: !this.state.canEditInstructorDetail })
    };

    updateInstructorDetails = (updatedInstructor) => {
        this.props.updateInstructor(updatedInstructor)
            .then( () => {
                this.setState({ selectedInstructor: updatedInstructor });
                //update instructor array with updated instructor
                const instructors = {...this.state.instructors};
                instructors[`instructor-${updatedInstructor.person_id}`] = updatedInstructor;
                this.setState({ instructors })
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    //Render the Instructor Desk component
    render() {
        return (
            <div id="CustomerDesk">

                <Navbar id="customer-desk-nav" >
                        <Nav id="customer-desk-nav-item" >
                            <NavDropdown eventKey="1" title="Instructor Tasks" id="customer-desk-nav-button">
                                <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/add/instructor`, state: {modal: false}}} >
                                    <MenuItem eventKey="1.1">
                                        <div id="quick-add-customer-button">
                                            Quick Add Instructor
                                        </div>
                                    </MenuItem>
                                </LinkContainer>
                                <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/modal/${this.props.schoolId}/dispatch/${this.state.selectedInstructor.person_id}`, state: {modal: true}}} >
                                    <MenuItem eventKey="1.2">
                                        <div id="quick-add-customer-button">
                                            Dispatch Instructor
                                        </div>
                                    </MenuItem>
                                </LinkContainer>
                            </NavDropdown>
                        </Nav>
                </Navbar>

                <InstructorList instructors={this.state.instructors}
                              selectInstructor={this.selectInstructor}
                />

                <InstructorDetail selectedInstructor={this.state.selectedInstructor}
                                         instructorIsSelected={this.state.instructorIsSelected}
                                         editInstructorDetail={this.editInstructorDetail}
                                         canEditInstructorDetail={this.state.canEditInstructorDetail}
                                         updateInstructorDetails={this.updateInstructorDetails}
                />
            </div>
        )
    }
}

InstructorDesk.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        schoolId: state.member.school_id
    }
};

export default connect(mapStateToProps, { updateInstructor, getAllInstructors })(InstructorDesk);