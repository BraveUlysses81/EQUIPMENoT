import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import TextFieldGroup from '../TextFieldGroup'
import { connect } from 'react-redux'
import { updateProfileAddress, getCustomerProfile } from '../../actions/profileActions'

const addressValidation = require('../../../routes/shared/addressValidation');


class ProfileAddressModal extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        person_id: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        errors: '',
        isFetching: false
    };

    static propTypes = {
        updateProfileAddress: PropTypes.func.isRequired,
        getCustomerProfile: PropTypes.func.isRequired
    };

    componentWillMount() {
        const person_id = this.props.match.params.person_id;
        this.setState({ person_id });
        this.getProfileInfo(person_id)
    }

    getProfileInfo = (person_id) => {
        this.props.getCustomerProfile(person_id)
            .then((data) => {
                this.setState({
                    address: data.data.address,
                    city: data.data.city,
                    state: data.data.state,
                    zip: data.data.zip,
                    country: data.data.country
                })
            })
            .catch(() => {
                this.setState( {errors: {form: 'Oops! Something went wrong on detail load.' }} )
            })
    };

    isvalid = () => {
        const { errors, isValid } = addressValidation(this.state)

        if(!isValid) {
            this.setState({ errors })
        }
        return isValid
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };

    handleAccept = (e) => {
        e.stopPropagation();
        this.setState({ errors: {}, isFetching: true });

        if(this.isvalid()) {
            this.props.updateProfileAddress(this.state)
                .then(
                    () => {
                        this.props.history.goBack()
                    })
                .catch((err) => {
                    if (err.response) {
                        this.setState({errors: {form: err.response.data}, isFetching: false})
                    }
                })
        }
    };

    handleCancel = (e) => {
    e.stopPropagation();
    this.props.history.goBack()
    };

    render() {
        const { errors, address, city, state, zip, country } = this.state;
        return (
            <div onClick={this.handleCancel}>
                <Modal show={true}>
                    <Modal.Header>
                        <Modal.Title id="modal-title">Update Address</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>

                            { errors.form && <div className="alert alert-danger">{errors.form}</div> }

                            <TextFieldGroup field="address"
                                            id="date-entry"
                                            value={address}
                                            label="Address"
                                            onChange={this.handleChange}
                                            error={errors.address}
                            />
                            <TextFieldGroup field="city"
                                            id="date-entry"
                                            value={city}
                                            label="City"
                                            onChange={this.handleChange}
                                            error={errors.city}
                            />
                            <TextFieldGroup field="state"
                                            id="date-entry"
                                            value={state}
                                            label="State"
                                            onChange={this.handleChange}
                                            error={errors.state}
                            />
                            <TextFieldGroup field="zip"
                                            id="date-entry"
                                            value={zip}
                                            label="Zip"
                                            onChange={this.handleChange}
                                            error={errors.zip}
                            />
                            <TextFieldGroup field="country"
                                            id="date-entry"
                                            value={country}
                                            label="Country"
                                            type="text"
                                            onChange={this.handleChange}
                                            error={errors.country}
                            />

                        </Modal.Body>
                        <Modal.Footer>

                            <Button onClick={this.handleCancel}>
                                Cancel
                            </Button>

                            <Button bsStyle="primary"
                                    disabled={this.state.isUpdating}
                                    onClick={this.handleAccept}
                            >
                                Save Changes
                            </Button>

                        </Modal.Footer>
                </Modal>
            </div>
        )
    }
}


export default connect(null, { updateProfileAddress, getCustomerProfile })(ProfileAddressModal);