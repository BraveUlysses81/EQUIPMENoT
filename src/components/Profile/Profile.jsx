import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import UserPhoto from '../UserPhoto'
import TextFieldGroup from '../TextFieldGroup'
import { Link } from 'react-router-dom'
import Memberships from './Memberships'


class Profile extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        first_name: '',
        last_name: '',
        username: '',
        login_email: '',
        mobile: '',
        errors: []
    }

    static propTypes = {
        person_id: PropTypes.number.isRequired,
        getCustomerProfile: PropTypes.func.isRequired
    }

    componentWillMount() {
        this.getProfileInfo()
    }

    getProfileInfo = () => {
       this.props.getCustomerProfile(this.props.person_id)
            .then((data) => {
                let mobile = data.data.mobile
                let digit = (mobile.length.toString()[0])

                if (mobile.length == 11 && digit === "1") {
                    mobile = mobile.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1-$2-$3-$4")
                }
                else if (mobile.length == 10) {
                    mobile = mobile.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
                } else {
                    mobile = ''
                }

                this.setState({
                    first_name: data.data.first_name,
                    last_name: data.data.last_name,
                    username: data.data.username,
                    login_email: data.data.login_email,
                    mobile: mobile
                })
            })
            .catch((err) => {
                console.log(err)
            })
    };

    onChange = () => {

    };

    render() {
        const { errors } = this.state;

        return(
            <div id="profile-container" className="row">
                <div className="col-xs-offset-4 col-sm-offset-2 col-lg-offset-1 col-lg-12">
                    <div id="profile-header" >
                        <div className="col-sm-12 col-md-6 col-lg-5">
                            <div className="row">
                                <UserPhoto picture_url={this.props.picture_url}
                                           imageID="profile-image"
                                           thumbnailSize="user fa-5x"/>
                            </div>
                            <div className="row" id="update-profile-container">
                                <div className="update-profile-links">
                                    <Link to={{
                                        pathname: `/modal/profile/contact/${this.props.person_id}`,
                                        state: {modal: true}
                                    } }>Update Contact Info</Link>

                                </div>
                                <div className="update-profile-links">
                                    <Link to={{
                                        pathname: `/modal/profile/address/${this.props.person_id}`,
                                        state: {modal: true}
                                    } }>Update Address</Link>

                                </div>
                                <div className="update-profile-links">
                                    <Link to={{
                                        pathname: `/modal/profile/emergency/${this.props.person_id}`,
                                        state: {modal: true}
                                    } }>Update Emergency Contact</Link>
                                </div>
                                <div className="update-profile-links">
                                    <Link to={{
                                        pathname: `/modal/profile/image/${this.props.person_id}`,
                                        state: {modal: true}
                                    } }>Change/Upload Profile Picture </Link>
                                </div>
                                <div className="update-profile-links">
                                    <Link to={{
                                        pathname: `/modal/profile/user/${this.props.person_id}`,
                                        state: {modal: true}
                                    } }>Change Password</Link>
                                </div>
                                <div className="update-profile-links">
                                    <Link to={{
                                        pathname: `/modal/profile/membership/${this.props.person_id}`,
                                        state: {modal: true}
                                    }}>Request School Membership</Link>
                                </div>
                                <div className="update-profile-links">
                                    <Link to={{
                                    pathname: `/modal/instructors/${this.props.person_id}`,
                                    state: {modal: true}
                                    } }>Add/Update Certificates
                                </Link>
                                </div>
                                <div className="update-profile-links">
                                    <Link to={{
                                        pathname: `/modal/profile/documents/${this.props.person_id}`,
                                        state: {modal: true}
                                    } }>Update Documentation
                                    </Link>
                                </div>

                            </div>
                            <div className="row">
                                <div>
                                    <br/>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-5 col-sm-offset-1">
                            <TextFieldGroup
                                inputId="profile-input"
                                field="first_name"
                                value={this.state.first_name}
                                label="First Name"
                                onChange={this.onChange}
                                error={errors.first_name}
                                readOnly={true}
                            />
                            <TextFieldGroup
                                inputId="profile-input"
                                field="last_name"
                                value={this.state.last_name}
                                label="Last Name"
                                onChange={this.onChange}
                                error={errors.last_name}
                                readOnly={true}
                            />
                            <TextFieldGroup
                                inputId="profile-input"
                                field="username"
                                value={this.state.username}
                                label="User Name"
                                onChange={this.onChange}
                                error={errors.username}
                                readOnly={true}
                            />
                            <TextFieldGroup
                                inputId="profile-input"
                                type="email"
                                field="login_email"
                                value={this.state.login_email}
                                label="Email"
                                onChange={this.onChange}
                                error={errors.email}
                                readOnly={true}
                            />
                            <TextFieldGroup
                                inputId="profile-input"
                                type="tel"
                                field="mobile"
                                value={this.state.mobile}
                                label="Mobile Phone"
                                onChange={this.onChange}
                                error={errors.mobile}
                                readOnly={true}
                            />
                            <div className="row">
                                <div id="profile-memberships-container">
                                    <Memberships />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile;