import React from 'react';
import { render } from 'react-dom';
import { ControlLabel, Checkbox, FormGroup, Form } from 'react-bootstrap';
import TextFieldGroup from '../TextFieldGroup';
import classnames from 'classnames'

class MobileContactForm extends React.Component {

    render() {
        const {errors, email, emergency_first_name, emergency_last_name, emergency_phone, isFetching} = this.props

        return (
            <div>
                <Form onSubmit={this.props.onSubmit}>

                    <div className={ classnames("form-group", {'has-error': errors.agreement_signed})}>
                        <ControlLabel id="contact-form-contact-header">Rental agreement</ControlLabel>
                        <Checkbox name="agreement_signed" onChange={this.props.handleChange}>
                            Agree to terms of service
                        </Checkbox>

                        { errors.agreement_signed ? (<span id="textfieldgroup-error"
                                                           className="help-block">{errors.agreement_signed }</span>) : (
                                <span id="textfieldgroup-error-none"></span>)}
                    </div>
                    <ControlLabel id="contact-form-contact-header">User information</ControlLabel>
                    <FormGroup id="contact-form">
                        <TextFieldGroup inputId="contact-form-email"
                                        field="email"
                                        value={email}
                                        label="Email Address"
                                        onChange={this.props.handleChange}
                                        error={errors.email}
                        />
                    </FormGroup>

                    <ControlLabel id="contact-form-contact-header">Emergency Contact Information</ControlLabel>
                    <FormGroup id="contact-form">

                        <TextFieldGroup inputId="contact-form-emergency-first"
                                        field="emergency_first_name"
                                        value={emergency_first_name}
                                        label="First Name"
                                        onChange={this.props.handleChange}
                                        error={errors.emergency_first_name}
                        />
                        <TextFieldGroup inputId="contact-form-emergency-last"
                                        field="emergency_last_name"
                                        value={emergency_last_name}
                                        label="Last Name"
                                        onChange={this.props.handleChange}
                                        error={errors.emergency_last_name}
                        />
                        <TextFieldGroup inputId="contact-form-emergency-phone"
                                        field="emergency_phone"
                                        value={emergency_phone}
                                        label="Phone"
                                        onChange={this.props.handleChange}
                                        error={errors.emergency_phone}
                        />

                    </FormGroup>

                    <div className="form-group">
                        <button
                            id="contact-form-btn"
                            disabled={isFetching}
                            className="btn btn-primary btn-lg"
                        >Submit
                        </button>
                    </div>

                </Form>
            </div>
        )
    }
}

export default MobileContactForm;


