import React from 'react';
import { render } from 'react-dom';
import { ControlLabel, Checkbox, FormGroup, Form } from 'react-bootstrap';
import TextFieldGroup from '../TextFieldGroup';
import classnames from 'classnames'

class EnterCodeFormForm extends React.Component {


    render() {
        const { errors, code, isFetching } = this.props

        return (
            <div>
                <Form onSubmit={this.props.onSubmit}>

                    <ControlLabel id="contact-form-contact-header">Enter Invite Code Provided in SMS</ControlLabel>
                    <FormGroup id="contact-form">

                        <div id="contact-form-code">
                        <TextFieldGroup inputId="contact-form-invite-code"
                                        field="code"
                                        value={code}
                                        label="Invite Code"
                                        onChange={this.props.handleChange}
                                        error={errors.email}
                        />
                        </div>

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

export default EnterCodeFormForm