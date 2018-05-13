import React from 'react';
import PropTypes from 'prop-types'
import dateFormat from 'dateformat'
import { render } from 'react-dom';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getInviteMembership, updateInvite } from '../../actions/adminActions';
import classnames from 'classnames'
import TextFieldGroup from '../TextFieldGroup'
const validateInput = require('../../../routes/shared/inviteAcceptValidation')



class AcceptInviteModal extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        invite_id: '',
        isFetching: false,
        first_name: '',
        last_name: '',
        mobile: '',
        agreement_signed: '',
        tsa_endorsement: '',
        regulation_type: '',
        medical_class: '',
        errors: '',
        school_id: '',
        person_id: ''
    }

    static propTypes = {
        getInviteMembership: PropTypes.func.isRequired
    }

    componentWillMount() {
        const invite_id = this.props.match.params.invite_id
        this.setState({ invite_id })
        this.getInviteInfo(invite_id)
    }

    getInviteInfo = (invite_id) => {
        this.props.getInviteMembership(invite_id)
            .then((person) => {
                this.setState({
                    first_name: person.data.first_name || '',
                    last_name: person.data.last_name || '',
                    mobile: person.data.mobile || '',
                    tsa_endorsement: person.data.tsa_endorsement || '',
                    regulation_type: person.data.regulation_type || '',
                    agreement_signed: person.data.agreement_signed || '',
                    faa_certificate_number: person.data.faa_certificate_number || '',
                    medical_class: person.data.medical_class || '',
                    school_id: person.data.school_id,
                    person_id: person.data.person_id,
                })
            })
            .catch((err) => {

            })
    }

    isvalid = () => {
        const { errors, isValid } = validateInput(this.state)

        if(!isValid) {
            this.setState({ errors })
        }

        return isValid
    }

    phoneNumberFormat = (number) => {
        if(number){
            let digit = (number.length.toString()[0]);
            if (number.length === 11 && digit === "1")
            {
                return (number.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1-$2-$3-$4"))
            }
            else if (number.length === 10)
            {
                return (number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"))
            }
            else
            {
                return number
            }
        } else {
            return ('')
        }
    }

    formatDates = (date) => {
        if(date){
            return (dateFormat(date, 'mediumDate'))
        } else {
            return('')
        }
    }

    handleSave = (e) => {
        this.setState({ errors: {}, isFetching: true })
        e.preventDefault()

        if (this.isvalid()) {
            this.props.updateInvite(this.state)
                .then(() => {
                    this.context.router.history.push(`/admin`, {modal: false, inviteID: this.state.invite_id})
                })
                .catch((err) => {
                    if (err.response) {
                        this.setState({errors: err.response.data, isFetching: false})
                    } else {
                        this.setState({errors: {form: 'Oops! Something went wrong.' }, isFetching: false})
                    }
                })
        }
    }

    handleChange = (e) => {
            this.setState({ [e.target.name]: e.target.value })
    }

    handleCancel = (e) => {
        e.stopPropagation()
        this.props.history.goBack()
    }

    render() {
        const { errors, first_name, last_name, mobile, tsa_endorsement, regulation_type, agreement_signed, faa_certificate_number, medical_class } = this.state

        return(
            <div>
                <Modal show={true}>
                    <Modal.Header>
                        <Modal.Title>Accept Membership</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={ classnames("form-group", {'has-error': errors.form})} >
                            <TextFieldGroup
                                field="first_name"
                                value={first_name}
                                label="First Name"
                                error={errors.first_name}
                                readonly={true}
                            />
                            <TextFieldGroup
                                field="last_name"
                                value={last_name}
                                label="Last Name"
                                error={errors.last_name}
                                readonly={true}
                            />
                            <TextFieldGroup
                                field="mobile"
                                value={this.phoneNumberFormat(mobile)}
                                label="Mobile"
                                error={errors.mobile}
                                readonly={true}
                            />
                            <TextFieldGroup
                                field="faa_certificate_number"
                                value={faa_certificate_number}
                                label="FAA Certificate Number"
                                error={errors.faa_certificate_number}
                                onChange={this.handleChange}
                            />
                            <TextFieldGroup
                                field="agreement_signed"
                                value={this.formatDates(agreement_signed)}
                                label="Agreement Signed Date"
                                error={errors.agreement_signed}
                                readonly={true}
                            />
                            <div className={ classnames("form-group", {'has-error': errors.medical_class})}>
                                <label
                                    id="form-label-medical_class"
                                    className="control-label"
                                >
                                    Medical Class
                                </label>
                                <select className="form-control"
                                        id="contact-form-medical-class"
                                        name="medical_class"
                                        onChange={this.handleChange}
                                        value={medical_class}

                                >
                                    <option value="none">None</option>
                                    <option value="one">Class One</option>
                                    <option value="two">Class Two</option>
                                    <option value="three">Class Three</option>

                                </select>
                                {
                                    errors.medical_class &&
                                    (<div>`${errors.medical_class}`</div>)
                                }
                            </div>

                            <div className={ classnames("form-group", {'has-error': errors.tsa_endorsement})} >
                                <label
                                    id="form-label-tsa_endorsement"
                                    className="control-label"
                                >
                                    TSA Endorsement
                                </label>
                                <select className="form-control"
                                        id="contact-form-tsa_endorsement"
                                        name="tsa_endorsement"
                                        onChange={this.handleChange}
                                        value={tsa_endorsement}
                                >
                                    <option value='' disabled>
                                        Choose the TSA Endorsement
                                    </option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                                    {
                                        errors.tsa_endorsement ?
                                        (<span id="textfieldgroup-error" className="help-block">{errors.tsa_endorsement }</span>)
                                        : (<span id="textfieldgroup-error-none">{errors.tsa_endorsement }</span>)
                                    }
                            </div>
                            <div className={ classnames("form-group", {'has-error': errors.regulation_type})} >
                                <label
                                    id="form-label-tsa_endorsement"
                                    className="control-label"
                                >
                                    Regulation Type
                                </label>
                                <select className="form-control"
                                        id="contact-form-regulation_type"
                                        name="regulation_type"
                                        onChange={this.handleChange}
                                        value={regulation_type}
                                >
                                    <option value='' disabled>
                                        Choose the Regulation Type
                                    </option>
                                    <option>61</option>
                                    <option>141</option>
                                </select>
                                {
                                    errors.regulation_type ?
                                        (<span id="textfieldgroup-error" className="help-block">{errors.regulation_type }</span>)
                                        : (<span id="textfieldgroup-error-none">{errors.regulation_type }</span>)
                                }
                            </div>
                            {
                                errors.form ?
                                    (<span id="textfieldgroup-error" className="help-block">{errors.form }</span>)
                                    : (<div/>)
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleCancel}>Cancel</Button>
                        <Button onClick={this.handleSave}bsStyle="primary" disabled={this.state.isFetching}
                                >Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

AcceptInviteModal.contextTypes = {
    router: PropTypes.object.isRequired
}

export default connect(null, { getInviteMembership, updateInvite })(AcceptInviteModal);
