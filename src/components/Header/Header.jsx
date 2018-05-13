import React from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import SearchBar from '../Search/SearchBar'
import LogOutUser from './LogOutUser'
import { loginUser, logOutUser } from '../../actions/authActions'
import './header.css'
import getProfileImage from '../../helpers/getProfileImage'


class Header extends React.Component {

    static propTypes = {
        loginUser: React.PropTypes.func.isRequired,
        logOutUser: React.PropTypes.func.isRequired,
        isAuthenticated: React.PropTypes.bool,
        user: React.PropTypes.object
    };

    render() {
        const profileImage = getProfileImage(this.props.user);

        const user = (
            <div id="head-nav-wrapper">
                <nav id="head-nav" className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <ul className="nav navbar-nav navbar-static-top">
                                <li>
                                    <SearchBar disabled={this.props.disabled} />
                                </li>
                            </ul>
                            <div id="header-login-button-group" className="navbar-header">
                                <ul id="header-login" className="nav navbar-nav navbar-right">
                                    <li>
                                        <LogOutUser logOutUser={this.props.logOutUser}
                                                    profileImage={profileImage}
                                                    school_logo={this.props.school_logo} />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        );

        const guest = (
            <div>
            </div>
        );

        return (
            <div>
                {this.props.isAuthenticated ? user : guest}
            </div>

        )
    }
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        school_logo: (state.member ? state.member.school_logo : ''),
        disabled: (!state.member || !state.member.member_view_rights)

    }
}

export default connect(mapStateToProps, { loginUser, logOutUser })(Header);