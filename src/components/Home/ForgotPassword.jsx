import React from 'react';
import { render } from 'react-dom';
import { ControlLabel, FormGroup, Form, Row, Col } from 'react-bootstrap';
import TextFieldGroup from '../TextFieldGroup';


class ForgotPassword extends React.Component {

    state = {
        email: '',
        errors: '',
        isFetching: ''
    }

    render() {
        const { errors, email, isFetching } = this.state

        return (
            <div id="forgot-password">
                    {/*<Col md={4}></Col>*/}
                    {/*<Col md={4} >*/}
                        <Form id="forgot-password-form" onSubmit={this.props.onSubmit}>

                            <ControlLabel id="forgot-password-contact-header">
                                Forgot your password?
                            </ControlLabel>

                            <FormGroup id="contact-form">

                                <div id="contact-form-code">
                                    <TextFieldGroup inputId="contact-form-invite-code"
                                                    field="email"
                                                    value={email}
                                                    label="Email Address"
                                                    onChange={this.handleChange}
                                                    error={errors.email}
                                    />
                                </div>

                                <div className="form-group">
                                    <button
                                        id="contact-form-btn"
                                        disabled={isFetching}
                                        className="btn btn-primary btn-lg"
                                    >Send Me Instructions
                                    </button>
                                </div>

                            </FormGroup>

                        </Form>
                    {/*</Col>*/}
                    {/*<Col md={4}></Col>*/}
            </div>
        )
    }
}

export default ForgotPassword