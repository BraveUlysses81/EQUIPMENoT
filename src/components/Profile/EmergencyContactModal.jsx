import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import TextFieldGroup from '../TextFieldGroup'
import { connect } from 'react-redux'
import { updateEmergencyContact, getCustomerProfile} from '../../actions/profileActions'
const emergencyContactValidation = require('../../../routes/shared/emergencyContactValidation')


class EmergencyContactModal extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        person_id: '',
        emergency_first_name: '',
        emergency_last_name: '',
        emergency_phone: '',
        errors: '',
        isFetching: false
    }

    static propTypes = {
        updateEmergencyContact: PropTypes.func.isRequired,
        getCustomerProfile: PropTypes.func.isRequired
    }

    componentWillMount() {
        const person_id = this.props.match.params.person_id
        this.setState({ person_id })
        this.getEmergencyContact(person_id)
    }

    formatPhoneNumber = (number) => {
        let digit = (number.length.toString()[0]);
        if (number.length === 11 && digit === "1") {
            return number.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1-$2-$3-$4");
        }
        else if (number.length === 10) {
            return number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        } else {
            return '';
        }
    }

    getEmergencyContact = (person_id) => {
        this.props.getCustomerProfile(person_id)
            .then((data) => {

                this.setState({
                    emergency_first_name: data.data.emergency_first_name,
                    emergency_last_name: data.data.emergency_last_name,
                    emergency_phone: this.formatPhoneNumber(data.data.emergency_phone)
                })
            })
            .catch((err) => {
                this.setState( {errors: {form: 'Oops! Something went wrong on detail load.' }} )
            })
    }

    isvalid = () => {
        const { errors, isValid } = emergencyContactValidation(this.state)

        if(!isValid) {
            this.setState({ errors })
        }

        return isValid
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleAccept = (e) => {
        e.stopPropagation()
        this.setState({ errors: {}, isFetching: true })

        if(this.isvalid()) {
            this.props.updateEmergencyContact(this.state)
                .then(
                    () => {
                        this.props.history.goBack()
                    })
                .catch((err) => {
                    if (err.response) {
                        this.setState({errors: err.response.data, isFetching: false})
                    }
                })
        }

    }

    handleCancel = (e) => {
        e.stopPropagation()
        this.props.history.goBack()
    }

    render () {
        const { errors, emergency_first_name, emergency_last_name, emergency_phone } = this.state

        return(
            <div className="static-modal">
                <Modal show={true}>
                    <Modal.Header>
                        <Modal.Title>Update Emergency Contact</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        { errors.form && <div className="alert alert-danger">{errors.form}</div> }

                        <TextFieldGroup field="emergency_first_name" value={emergency_first_name}
                                        label="First Name"
                                        onChange={this.handleChange}
                                        error={errors.emergency_first_name}
                        />
                        <TextFieldGroup field="emergency_last_name" value={emergency_last_name}
                                        label="Last Name"
                                        onChange={this.handleChange}
                                        error={errors.emergency_last_name}
                        />
                        <TextFieldGroup field="emergency_phone" value={emergency_phone}
                                        label="Phone Number"
                                        type="tel"
                                        onChange={this.handleChange}
                                        error={errors.emergency_phone}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleCancel}>Cancel</Button>
                        <Button bsStyle="primary" disabled={this.state.isFetching}
                                onClick={this.handleAccept}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default connect(null, { updateEmergencyContact, getCustomerProfile })(EmergencyContactModal);