import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import EmailContactForm from './EmailContactForm'
import { emailContactFormAddRequest, verifyInviteStatus } from'../../actions/authActions';
import { connect } from 'react-redux';

const validateInput = require('../../../routes/shared/emailContactFormValidation');


class EmailContactContainer extends React.Component {
    state = {
        invite_id: '',
        invite_verified: false,
        username: '',
        password: '',
        passwordConfirmation: '',
        faa_certificate_number: '',
        faa_certificate_desc: '',
        faa_written_test_exp: '',
        medical_class: '',
        medical_date: '',
        dob: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        phone: '',
        fax: '',
        errors: {},
        isValid: false,
        isFetching: false
     }

    constructor(props) {
        super(props)
    }

    static propTypes = {
        emailContactFormAddRequest: PropTypes.func.isRequired,
        verifyInviteStatus: PropTypes.func.isRequired
    }

     componentWillMount(){
         const invite_id = this.props.match.params.invite_id
         this.getInviteStatus(invite_id)
         this.setState({ invite_id })
     }

     getInviteStatus = (invite_id) => {
         this.props.verifyInviteStatus(invite_id)
             .then((status) => {
                if(status.data.onboarding_status == 'pending'){
                    this.setState({ invite_verified: true})
                } else {
                    this.setState({errors: {form: 'Invite is not open' } })
                }
             })
             .catch((err) => {
                 if (err) {
                     this.setState({ errors: {form: 'Oops! Something went wrong.' } })
                 }
             })
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
            this.props.emailContactFormAddRequest(this.state)
                .then(
                    () => {
                        this.context.router.history.push('/submit/success');
                    })
                .catch((err) => {
                    if (err.response) {
                        this.setState({errors: {form: err.response.data }, isFetching: false})
                    } else {
                        this.setState({errors: {form: 'Oops! Something went wrong.' }, isFetching: false})
                    }
                })
        }
    }

     handleChange = (e) => {
             this.setState({ [e.target.name]: e.target.value })
     }

    render() {
         const { errors } = this.state
        return (
            <div id="contact-form-container">
                <div id="email-contact-form-header">
                    <h1>EQUIP.ME.NoT Sign Up Form</h1>
                </div>
            <div id="ContactForm">
                {
                    this.state.invite_verified ?
                        <EmailContactForm
                            handleChange={this.handleChange}
                            onSubmit={this.onSubmit}
                            {...this.state}
                        />
                    :   (
                            <h2>
                                <span id="textfieldgroup-error" className="help-block">
                                    {errors.form }
                                 </span>
                            </h2>
                        )
                }

            </div>
            </div>

        )
    }
}

EmailContactContainer.contextTypes = {
    router: PropTypes.object.isRequired
}

export default connect(null, { emailContactFormAddRequest, verifyInviteStatus })(EmailContactContainer);

