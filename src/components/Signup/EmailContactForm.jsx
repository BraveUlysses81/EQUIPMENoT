import React from 'react';
import { render } from 'react-dom';
import TextFieldGroup from '../TextFieldGroup';
import { ControlLabel, FormGroup, Form } from 'react-bootstrap';


const EmailContactForm = (props) => {
    const { handleChange, onSubmit,  } = props

    const { errors, isFetching, username, password, passwordConfirmation, medical_class, medical_date, faa_written_test_exp,
        faa_certificate_desc, dob, faa_certificate_number, address, city, state, country, zip, phone, fax,} = props

    return(
        <div id="email-contact-form-wrapper">
            <Form onSubmit={onSubmit} >
                {
                    errors.form &&
                    <div>`${errors.form}`</div>
                }

                <div className="col-md-6">
                    <ControlLabel id="contact-form-contact-header">User information</ControlLabel>

                    <FormGroup id="contact-form">

                        <div id="contact-form-uname">
                            <TextFieldGroup inputId="contact-form-username"
                                            field="username"
                                            value={username}
                                            label="User Name"
                                            onChange={handleChange}
                                            error={errors.username}
                            />
                        </div>

                        <div id="contact-form-pwd">
                            <TextFieldGroup inputId="contact-form-password"
                                            id="contact-form-pwd"
                                            type="password"
                                            field="password"
                                            value={password}
                                            label="Password"
                                            onChange={handleChange}
                                            error={errors.password}
                            />
                        </div>

                        <div id="contact-form-pwd-conf">
                            <TextFieldGroup inputId="contact-form-password-confirmation"
                                            type="password" field="passwordConfirmation"
                                            value={passwordConfirmation}
                                            label="Confirm Password"
                                            onChange={handleChange}
                                            error={errors.passwordConfirmation}
                            />
                        </div>
                    </FormGroup>

                    <ControlLabel id="contact-form-contact-header">Certification Information</ControlLabel>

                    <FormGroup id="contact-form">

                        <div className="col-md-6">
                            <div id="contact-form-faa">
                                <TextFieldGroup inputId="contact-form-faa_certificate_number"
                                                field="faa_certificate_number"
                                                value={faa_certificate_number}
                                                label="FAA Certificate Number"
                                                onChange={handleChange}
                                                error={errors.faa_certificate_number}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div id="contact-form-test">
                                <TextFieldGroup inputId="contact-form-faa_written_test_exp"
                                                field="faa_written_test_exp"
                                                value={faa_written_test_exp}
                                                type="date"
                                                label="FAA written test expiration"
                                                onChange={handleChange}
                                                error={errors.faa_written_test_exp}
                                />
                            </div>
                        </div>

                        <div id="contact-form-cert-desc">
                            <label
                                id="form-label-certificate_desc"
                                className="control-label">
                                FAA Certificate Description
                            </label>
                            <select className="form-control"
                                    id="contact-form-certificate_desc"
                                    name="faa_certificate_desc"
                                    onChange={handleChange}
                                    value={faa_certificate_desc}>
                                <option value='' disabled>
                                    Choose the FAA Certificate Description
                                </option>
                                <option>Pilot</option>
                                <option>Instructor</option>
                            </select>
                            {
                                errors.faa_certificate_desc &&
                                (<div>`${errors.faa_certificate_desc}`</div>)
                            }
                        </div>

                        <div className="col-md-6">
                            <div id="contact-form-med">
                                <label
                                    id="form-label-medical_class"
                                    className="control-label"
                                >
                                    Medical Class
                                </label>
                                <select className="form-control"
                                        id="contact-form-medical-class"
                                        name="medical_class"
                                        onChange={handleChange}
                                        value={medical_class}
                                >
                                    <option value='' disabled>
                                        Choose Your Medical Class
                                    </option>
                                    <option value="one">Class One</option>
                                    <option value="two">Class Two</option>
                                    <option value="three">Class Three</option>
                                </select>
                                {
                                    errors.membership_type &&
                                    (<div>`${errors.medical_class}`</div>)
                                }
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div id="contact-form-dte">
                                <TextFieldGroup inputId="contact-form-medical_date"
                                                field="medical_date"
                                                type="date"
                                                value={medical_date}
                                                label="Date of Medical"
                                                onChange={handleChange}
                                                error={errors.medical_date}
                                />
                            </div>
                        </div>

                    </FormGroup>

                </div>

                <div className="col-md-6">
                    <ControlLabel id="contact-form-contact-header">Address and Contact Information</ControlLabel>

                    <FormGroup id="contact-form">

                        <div id="contact-form-addy">
                            <TextFieldGroup inputId="contact-form-address"
                                            field="address"
                                            value={address}
                                            label="Address"
                                            onChange={handleChange}
                                            error={errors.address}
                            />
                        </div>

                        <div className="col-md-6">
                            <div id="contact-form-cty">
                                <TextFieldGroup inputId="contact-form-city"
                                                field="city"
                                                value={city}
                                                label="City"
                                                onChange={handleChange}
                                                error={errors.city}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div id="contact-form-sta">
                                <TextFieldGroup inputId="contact-form-state"
                                                field="state"
                                                value={state}
                                                label="State"
                                                onChange={handleChange}
                                                error={errors.state}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div id="contact-form-zp">
                                <TextFieldGroup inputId="contact-form-zip"
                                                field="zip"
                                                value={zip}
                                                label="Zip"
                                                onChange={handleChange}
                                                error={errors.zip}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div id="contact-form-cntry">
                                <TextFieldGroup inputId="contact-form-country"
                                                field="country"
                                                value={country}
                                                label="Country"
                                                onChange={handleChange}
                                                error={errors.country}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div id="contact-form-hm">
                                <TextFieldGroup inputId="contact-form-home"
                                                field="phone"
                                                value={phone}
                                                label="Home Phone"
                                                type="tel"
                                                onChange={handleChange}
                                                error={errors.phone}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div id="contact-form-fx">
                                <TextFieldGroup inputId="contact-form-fax"
                                                field="fax"
                                                value={fax}
                                                label="Fax"
                                                type="tel"
                                                onChange={handleChange}
                                                error={errors.fax}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div id="contact-form-db">
                                <TextFieldGroup inputId="contact-form-dob"
                                                field="dob"
                                                value={dob}
                                                label="Date of Birth"
                                                type="date"
                                                onChange={handleChange}
                                                error={errors.dob}
                                />
                            </div>
                        </div>

                    </FormGroup>

                </div>





                <div id="contact-form-btn-grp">
                    <button
                        id="contact-form-btn"
                        disabled={isFetching}
                        className="btn btn-primary btn-lg"
                    >Submit</button>
                </div>

            </Form>
        </div>
    )
};

export default EmailContactForm;