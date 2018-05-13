import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import Profile from './Profile'
import { connect } from 'react-redux'
import { getCustomerProfile } from '../../actions/profileActions'
import './profile.css'
import getProfileImage from '../../helpers/getProfileImage'

const config = require('../../../config/config');

class ProfileContainer extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        profileImage: ''
    };

    static propTypes = {
        user: PropTypes.object.isRequired,
        getCustomerProfile: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.setState({ profileImage: getProfileImage(this.props.user)});
        //set history for router to return to after modals are closed
        this.context.router.history.push(`/profile/`)
    }

    render() {
        return(
            <div className="container">
                <Profile picture_url={this.state.profileImage}
                               person_id={this.props.user.person_id}
                               getCustomerProfile={this.props.getCustomerProfile}
                />
            </div>
        )
    }
}

ProfileContainer.contextTypes = {
    router: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps, { getCustomerProfile })(ProfileContainer);