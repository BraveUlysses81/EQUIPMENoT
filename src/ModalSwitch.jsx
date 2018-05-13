import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './router.css'

import { connect } from 'react-redux';
import FlightDesk from './components/Flight/FlightDesk';
import CloseFlightDesk from './components/CloseFlight/CloseFlightDesk';
import CustomerDesk from './components/Customer/CustomerDesk';
import AddCustomer from './components/Customer/AddCustomer';
import InstructorDesk from './components/Instructor/InstructorDesk';
import AddInstructor from './components/Instructor/AddInstructor';
import AircraftDesk from './components/Aircraft/AircraftDesk';
import AddAircraft from './components/Aircraft/AddAircraft';
import GroundAircraft from './components/Aircraft/GroundAircraft';
import HomeDesk from './components/Home/HomeDesk';
import SignupDesk from './components/Signup/SignupDesk';
import EmailContactContainer from './components/Signup/EmailContactContainer';
import MobileContactContainer from './components/Signup/MobileContactContainer';
import AdminDesk from './components/Admin/AdminDesk';
import AcceptInviteModal from './components/Admin/AcceptInviteModal';
import ForgotPassword from './components/Home/ForgotPassword';
import NotFound from './components/NotFound';
import ProfileContainer from './components/Profile/ProfileContainer';
import PrivateRoute from './PrivateRoute';
import DispatchModal from './components/Dispatch/DispatchModal';
import InstructorModal from './components/Instructor/InstructorModal';
import CloseFlightModal from './components/CloseFlight/CloseFlightModal';
import SignupSuccess from './components/Signup/SignupSuccess';
import FormSuccess from './components/Signup/FormSuccess';
import SelectMembership from './components/Home/SelectMembership';
import ProfileAddressModal from './components/Profile/ProfileAddressModal';
import EmergencyContactModal from './components/Profile/EmergencyContactModal';
import UserUpdateModal from './components/Profile/UserUpdateModal';
import ContactModal from './components/Profile/ContactModal';
import ProfileImageUpload from './components/Profile/ProfileImageUpload'
import MembershipRequest from './components/Profile/MembershipRequest';
import FlightModalDetailModal from './components/FlightModalDetail/FlightModalDetailModal';
import DocumentsModal from './components/Profile/DocumentsModal';
import CheckoutModal from './components/Customer/CheckoutModal';




class ModalSwitch extends React.Component {

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        dispatch_view_rights: PropTypes.bool,
        admin_view_rights: PropTypes.bool,
        instructor_view_rights: PropTypes.bool
    }

    constructor(props){
        super(props)
    }

    previousLocation = this.props.location
    
    componentWillReceiveProps(nextProps){
        const { location } = nextProps
        // set previousLocation if props.location is not modal
        if (nextProps.history.action !== 'POP' && (!location.state || !location.state.modal)) {
            this.previousLocation = this.props.location
        }
    }

    render () {
        const { location } = this.props

        let isModal = (
            location.state &&
            location.state.modal &&
            this.previousLocation !== location // not initial render
        )

        return (
            <div className="container-fluid" id="no-padding">
                <Switch  location={isModal ? this.previousLocation : location}>
                    <Route exact path='/' component={HomeDesk} />
                    <Route path='/signup' component={SignupDesk} />
                    <Route path='/welcome' component={SignupSuccess} />
                    <Route path='/submit/success' component={FormSuccess} />
                    <Route path='/contact/form/mobile/member/:invite_id' component={MobileContactContainer} />
                    <Route path='/contact/form/email/member/:invite_id' component={EmailContactContainer} />
                    <Route path='/signin/forgot_password' component={ForgotPassword} />
                    <PrivateRoute path='/membership' component={SelectMembership} allowedViewRights={['user']} {...this.props} />
                    <PrivateRoute path='/profile' component={ProfileContainer} allowedViewRights={['user']} {...this.props} />
                    <PrivateRoute path='/dispatch' component={FlightDesk} allowedViewRights={['dispatch', 'admin']} {...this.props} />
                    <PrivateRoute path='/closeflight' component={CloseFlightDesk} allowedViewRights={['dispatch', 'admin']} {...this.props} />
                    <PrivateRoute path='/customers' component={CustomerDesk} allowedViewRights={['dispatch', 'admin']} {...this.props} />
                    <PrivateRoute path='/add/customer' component={AddCustomer} allowedViewRights={['dispatch', 'admin']} {...this.props} />
                    <PrivateRoute path='/instructors' component={InstructorDesk} allowedViewRights={['dispatch', 'admin']} {...this.props} />
                    <PrivateRoute path='/add/instructor' component={AddInstructor} allowedViewRights={['dispatch', 'admin']} {...this.props} />
                    <PrivateRoute path='/aircraft' component={AircraftDesk} allowedViewRights={['dispatch', 'admin']} {...this.props} />
                    <PrivateRoute path='/add/aircraft' component={AddAircraft} allowedViewRights={['dispatch', 'admin']} {...this.props} />
                    <PrivateRoute path='/admin' component={AdminDesk} allowedViewRights={['admin']} {...this.props} />
                    <Route component={NotFound} />
                </Switch>
                <div>
                    {
                    isModal ?
                        <Route
                            path='/modal'
                            render={() => (
                                <switch>
                                    <Route exact path='/modal/instructors/:personId'
                                           component={InstructorModal} />
                                    <Route exact path='/modal/flights/:flightId'
                                           component={CloseFlightModal} />
                                    <Route  exact path='/modal/:schoolId/dispatch/:personId'
                                            component={DispatchModal} />
                                    <Route exact path='/modal/profile/address/:person_id'
                                           component={ProfileAddressModal} />
                                    <Route exact path='/modal/profile/emergency/:person_id'
                                           component={EmergencyContactModal} />
                                    <Route exact path='/modal/profile/user/:person_id'
                                           component={UserUpdateModal} />
                                    <Route exact path='/modal/profile/contact/:person_id'
                                           component={ContactModal} />
                                    <Route exact path='/modal/profile/image/:person_id'
                                           component={ProfileImageUpload} />
                                    <Route exact path='/modal/profile/membership/:person_id'
                                            component={MembershipRequest}/>
                                    <Route exact path='/modal/admin/invite/:invite_id'
                                           component={AcceptInviteModal} />
                                    <Route exact path='/modal/flightdetail/:flightId'
                                           component={FlightModalDetailModal} />
                                    <Route exact path='/modal/aircraft/ground'
                                           component={GroundAircraft} />
                                    <Route exact path='/modal/profile/documents/:personId'
                                           component={DocumentsModal} />
                                    <Route exact path='/modal/customer/checkouts/:membershipid'
                                           component={CheckoutModal} />
                                </switch>
                            )}
                        /> : null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state =>
    ({
        isAuthenticated: state.isAuthenticated,
        user_view_rights: (!!state.isAuthenticated),
        member_view_rights: state.member.member_view_rights,
        dispatch_view_rights: state.member.dispatch_view_rights,
        instructor_view_rights: state.member.instructor_view_rights,
        admin_view_rights: state.member.admin_view_rights
    })

export default connect(mapStateToProps)(ModalSwitch);