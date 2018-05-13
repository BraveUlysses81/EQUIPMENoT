
import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import TextFieldGroup from '../TextFieldGroup'
import { server } from '../../helpers/serverAddress'
import axios from 'axios/index'
const loginValidation = require('../../../routes/shared/loginValidation')


class LoginForm extends React.Component {

    state = {
        identifier: '',
        password: '',
        errors: '',
        isFetching: false
    }

    constructor(props){
        super(props)
    }

    static propTypes = {
        loginUser: PropTypes.func.isRequired
    }

    isValid = () => {
        const { errors, isValid } = loginValidation(this.state)

        if(!isValid) {
            this.setState({ errors })
        }

        return isValid
    }

    onSubmit = (e) => {
        e.preventDefault()
        this.setState({isFetching: true})
        if (this.isValid()) {
            this.setState({ errors: {}, isFetching: true })
            this.props.loginUser(this.state)
                .then(
                    () => {
                        this.context.router.history.push(`/membership`);
                    })
                .catch((err) => {
                    if(err.response) {
                        this.setState({errors: err.response.data, isFetching: false})
                    } else {
                        this.setState({errors: {form: 'Oops something went wrong.'}, isFetching: false})
                    }
                })
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    registerClick = () => {
        this.context.router.history.push('/signup')
    }


    render () {
        const {errors, identifier, password, isFetching } = this.state
        return (
               <div>
                    <form onSubmit={this.onSubmit}>
                        <h1>Login</h1>

                        { errors.form && <div id="home-login-alert" className="alert alert-danger">{errors.form}</div> }

                        <TextFieldGroup id="home-margin-top"
                            labelId="home-login-label"
                            inputId="home-login-input"
                            field="identifier"
                            label="Username / Email"
                            value={identifier}
                            error={errors.identifier}
                            onChange={this.onChange}
                        />

                        <TextFieldGroup
                            labelId="home-login-label"
                            inputId="home-login-input"
                            field="password"
                            label="Password"
                            value={password}
                            error={errors.password}
                            onChange={this.onChange}
                            type="password"
                        />

                        <li>
                            <button type="submit"
                                    className="btn btn-default"
                                    id="home-login-btn"
                                    onClick={this.loginOnClick}
                                    disabled={isFetching}
                            >
                                Login
                            </button>
                            <button type="submit"
                                    className="btn btn-default"
                                    id="home-register-btn"
                                    onClick={this.registerClick}>
                                Register
                            </button>
                        </li>

                        <div id="password-help">
                            <Link id="nav-icon" to={{pathname: `/signin/forgot_password`, state: {modal: false}}}
                            >Forgot your password?</Link>
                        </div>
                    </form>
               </div>
        )
    }
}

LoginForm.contextTypes = {
    router: PropTypes.object.isRequired
}

export default LoginForm;