import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames'
import MobileContactForm from './MobileContactForm';
import EnterCodeForm from './EnterCodeForm';
import { mobileContactFormAddRequest } from'../../actions/authActions';
import { mobileContactFormAddRequestExtra } from'../../actions/authActions';
import { connect } from 'react-redux';
const validateInput = require('../../../routes/shared/mobileContactFormValidation');

class MobileContactContainer extends React.Component {
    state = {
        hasCode: false,
        code: '',
        invite_id: '',
        agreement_signed: false,
        email: '',
        emergency_first_name: '',
        emergency_last_name: '',
        emergency_phone: '',
        errors: {},
        isFetching: false
    }

    constructor(props) {
        super(props)
    }

    static propTypes = {
        mobileContactFormAddRequest: PropTypes.func.isRequired
    }

    componentWillMount(){
        const invite_id = this.props.match.params.invite_id
        this.setState({ invite_id })
    }

    isvalid = () => {
        const { errors, isValid } = validateInput(this.state)

        if(!isValid) {
            this.setState({ errors, isFetching: false })
        }

        return isValid
    }

    onSubmit = (e) => {
        e.preventDefault()
        this.setState({ errors: {}, isFetching: true })

        if(this.isvalid()) {
            this.props.mobileContactFormAddRequest(this.state)
                .then(
                    () => {
                        this.context.router.history.push('/welcome');
                    })
                .catch((err) => {
                    if(err.response) {
                        this.setState({errors: err.response.data, isFetching: false})
                    } else {
                        this.setState(
                            {errors: {form: 'Oops! Something went wrong.' }, isFetching: false})
                    }
                })
        }
    }

    submitCodeForm = (e) => {
        e.preventDefault()
        this.setState({ errors: {}, isFetching: true })

        this.props.mobileContactFormAddRequestExtra(this.state)
            .then(() =>
                this.setState({ hasCode: true, isFetching: false})
            )
            .catch((err) => {
                if (err.response) {
                    this.setState({hasCode: false, isFetching: false, errors: {form: err.response.data.form}})
                } else {
                    this.setState(
                        {hasCode: false, isFetching: false, errors: {form: 'Oops! Something went wrong.'}}
                    )
                }
            }
        )
    }

    handleChange = (e) => {
        //check if target is agreement signed checkbox and handle
        if(e.target.name == 'agreement_signed') {
            if(e.target.checked) {
                 this.setState({ agreement_signed: true })
             }else {
                 this.setState({ agreement_signed: false })
             }
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
    }

    render() {
        const { hasCode, code, errors, isFetching, email, emergency_first_name, emergency_last_name, emergency_phone}  = this.state
        return(
            <div id="ContactForm">

                <div className={ classnames("form-group", {'has-error': errors.form})}>
                    { errors.form ? (
                            <span id="textfieldgroup-error" className="help-block">{errors.form }</span>) : (
                            <span id="textfieldgroup-error-none"></span>)}
                </div>

                { hasCode ? (<MobileContactForm
                        errors={errors}
                        email={email}
                        emergency_first_name={emergency_first_name}
                        emergency_last_name={emergency_last_name}
                        emergency_phone={emergency_phone}
                        isFetching={isFetching}
                        handleChange={this.handleChange}
                        onSubmit={this.onSubmit}/>)
                    : (<EnterCodeForm errors={errors}
                                      code={code}
                                      handleChange={this.handleChange}
                                      isFetching={isFetching}
                                      onSubmit={this.submitCodeForm}
                        />)
                }
            </div>
            )

    }
}

MobileContactContainer.contextTypes = {
    router: PropTypes.object.isRequired
}

export default connect(null, { mobileContactFormAddRequest, mobileContactFormAddRequestExtra })(MobileContactContainer);