// EQUIP.ME.NoT Home Desk


import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { loginUser, logOutUser } from '../../actions/authActions'
import LoginForm from './LoginForm'
import { connect } from 'react-redux'
import './home.css'

class HomeDesk extends React.Component {

    static propTypes = {
        loginUser: PropTypes.func.isRequired,
        logOutUser: PropTypes.func.isRequired,
        redirectToReferrer: PropTypes.bool,
        isAuthenticated: PropTypes.bool
    }

    constructor() {
        super()
    }

    render () {
        const { from } = this.props.location.state || { from: {pathname: '/'} }

        const user = (
            <div id="home-logout-container">
                <h1 id="home-logout-text">What do you need??</h1>
                <br/>
                <img id="home-logout-logo" src={ '/img/equipmenot.png' } />
                <br/>
                <button
                    id="home-logout-btn"
                    type="submit"
                    className="btn btn-default"
                    onClick={this.props.logOutUser}
                >
                    Logout
                </button>
            </div>
        )

        const guest = (
            <div>
                <LoginForm
                    loginUser={this.props.loginUser}
                    redirectToReferrer={this.props.redirectToReferrer}
                    from={from}
                />
            </div>
        )

        return (
            <div id="home-desk-login-body">
            <div id="HomeDesk">
                <div id="home-login-form">
                    <h1 id="home-title">EQUIP.ME.NoT</h1>
                    <div id="home-login-form-container">
                        <ul id="home-login-menu" role="menu">
                            { this.props.isAuthenticated ? user : guest }
                        </ul>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.isAuthenticated,
        redirectToReferrer: state.redirectToReferrer
    }
}

export default connect(mapStateToProps, { loginUser, logOutUser  })(HomeDesk) ;

