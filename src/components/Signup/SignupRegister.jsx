
import React from 'react';
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { server } from '../../helpers/serverAddress';
import axios from 'axios';
import TextFieldGroup from '../TextFieldGroup'
const validateInput = require('../../../routes/shared/quickAddValidation')

class SignupRegister extends React.Component {
    state = {
        first_name: '',
        last_name: '',
        mobile: '',
        membership_type: '',
        school_id: '',
        errors: '',
        isFetching: false,
        schools: ''
    }

    static propTypes = {
        membership_type: PropTypes.string.isRequired,
    }

    componentDidMount() {
        this.setState({ membership_type: this.props.membership_type})
        axios.get(`${server}/schools`)
            .then((data) => {
                data.data.map((i) => {

                    const schools = {...this.state.schools} //create a copy of the checkout state
                    schools[`s-${i.school_id}`] = i // add the checkout to the checkout copy
                    this.setState({ schools }) //call set state with the updated copy
                })
            })
            .catch(() => {
                this.setState( {errors: {form: 'Oops! Something went wrong.' }} )
            })
    }

    onChange = (e) => {

        this.setState({ [e.target.name]: e.target.value })
    }

    isvalid = () => {
        const { errors, isValid } = validateInput(this.state)

        if(!isValid) {
            this.setState({ errors })
        }
        return isValid
    }

    handleSubmit = (e) => {
        e.preventDefault()

        this.setState({ errors: {}, isFetching: true })

        if(this.isvalid()) {
            this.props.memberQuickAddRequest(this.state, this.state.school_id)
                .then(
                    () => {
                        this.context.router.history.push('/welcome');
                    })
                .catch((err) => {
                    if (err.response) {
                        this.setState({errors: err.response.data, isFetching: false})
                    }else {
                        this.setState({errors: {form: 'Oops! Something went wrong.' }, isFetching: false})
                    }
                })
        } else {
            this.setState({ isFetching: false })
        }
    }

    render () {
        const { errors, schools, first_name, last_name, school_id, mobile } = this.state;
        const schoolsArray = Object.keys(schools)
            .map(key => <option key={key} value={schools[key].school_id}>{`${schools[key].school_name}`}</option>
            )

        return(
            <div>
                <div id="">
                    <div className={ classnames("form-group", {'has-error': errors.form})}>
                        { errors.form ? (
                                <span id="textfieldgroup-error" className="help-block">{errors.form }</span>) : (
                                <span id="textfieldgroup-error-none"></span>)}
                    </div>
                    <div className="form-group">
                        <label
                            id="signup-register-school"
                            className="control-label"
                        >
                            School
                        </label>
                        <select
                            id="signup-register-school-select"
                            className="form-control"
                            name="school_id"
                            onChange={this.onChange}
                            value={school_id}
                        >
                            <option
                                value=''
                                disabled
                            >
                                Choose Your Default School
                            </option>

                            {/*Lists the School Options For Registering*/}
                            {schoolsArray}
                        </select>
                        {
                            errors.school_id &&
                            (<span id="textfieldgroup-error" className="help-block">{errors.school_id}</span>)
                        }
                    </div>
                </div>

                <br/>

                <div id="home-login-container">
                    <TextFieldGroup
                        labelId="home-login-label"
                        inputId="home-login-input"
                        field="first_name"
                        value={first_name}
                        label="First Name"
                        onChange={this.onChange}
                        error={errors.first_name}
                    />
                </div>

                <div id="home-login-container">
                    <TextFieldGroup
                        labelId="home-login-label"
                        inputId="home-login-input"
                        field="last_name"
                        value={last_name}
                        label="Last Name"
                        onChange={this.onChange}
                        error={errors.last_name}
                    />
                </div>

                <div id="home-login-container">
                    <TextFieldGroup
                        labelId="home-login-label"
                        inputId="home-login-input"
                        field="mobile"
                        value={mobile}
                        label="Mobile Phone"
                        onChange={this.onChange}
                        error={errors.mobile}
                    />
                </div>

                <br/>
                <br/>
                <div id="home-login-container">
                    <div id="home-signup-btn-container" className="form-group">
                        <button onClick={this.handleSubmit}
                            id="home-login-btn"
                            disabled={this.state.isFetching}
                            className="btn btn-primary btn-lg"
                        >Sign up</button>
                    </div>
                </div>
            </div>
        )
    }
}

SignupRegister.contextTypes = {
    router: PropTypes.object.isRequired
}

export default SignupRegister;