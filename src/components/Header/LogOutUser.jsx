import FontAwesome from 'react-fontawesome'
import Radium from 'radium'
import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import UserPhoto from '../UserPhoto'


class LogOutUser extends React.Component {

    constructor(props) {
        super(props)
    }

    static propTypes = {
        logOutUser: PropTypes.func.isRequired,
        user: PropTypes.object
    };

    handleProfileClick = () => {
        this.context.router.history.push('/profile')
    };

    render () {
        const { profileImage, school_logo } = this.props
        return (
            <div id="header-login-default-group" className="btn-group" >
                <div className="btn btn-default" id="user-circle">
                    {profileImage ?
                        <UserPhoto picture_url={profileImage} imageID="list-photo" thumbnailSize="user fa-2x"/> :
                        <a href="#" style={{ color: 'lightgray' }}><FontAwesome id="login-user-circle" name="user-circle fa-2x"/></a>
                    }
                </div>
                <div id="login-button" className="btn btn-default dropdown-toggle pull-right" type="button" data-toggle="dropdown">
                    {/*<span className="caret"></span>*/}
                    <FontAwesome id="login-chevron" name="chevron-down fa-2x"/>
                </div>
                <div className="btn btn-default" id="school-logo">
                    <img id="school-logo-image" src={school_logo}/>
                </div>

                <ul id="logout-dropdown" className="dropdown-menu dropdown-lr animated fadeInDown" role="menu">
                    <br/>

                    <li id="logout-profile-button-group">
                        <button type="submit"
                                onClick={ () => this.props.logOutUser()}
                                className="btn btn-default"
                                id="login-btn" >Logout</button>
                        <button type="submit"
                                onClick={this.handleProfileClick}
                                className="btn btn-default"
                                id="profile-btn">Profile</button>
                    </li>
                </ul>
            </div>
        )
    }
}

LogOutUser.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Radium(LogOutUser);