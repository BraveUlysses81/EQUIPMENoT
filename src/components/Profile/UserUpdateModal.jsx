import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import TextFieldGroup from '../TextFieldGroup'
import { connect } from 'react-redux'
import { updateUser } from '../../actions/profileActions'
const updatePasswordValidation = require('../../../routes/shared/updatePasswordValidation')


class UserUpdateModal extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        login_id: '',
        person_id: '',
        newPassword: '',
        currentPassword: '',
        passwordConfirmation: '',
        errors: '',
        isFetching: false
    };

    static propTypes = {
        updateUser: PropTypes.func.isRequired,
        login_id: PropTypes.number.isRequired
    };

    componentWillMount() {
        const person_id = this.props.match.params.person_id
        const { login_id } = this.props
        this.setState({ person_id, login_id })
    };

    isvalid = () => {
        const { errors, isValid } = updatePasswordValidation(this.state)

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
            this.props.updateUser(this.state)
                .then(
                    () => {
                        this.props.history.goBack()
                    })
                .catch((err) => {
                    if(err.response) {
                        this.setState({ errors: {form: err.response.data}})
                    }else {
                        this.setState({ errors: {form: 'Oops! Something went wrong.'}})
                    }
                })
        }

    };

    handleCancel = (e) => {
        e.stopPropagation();
        this.props.history.goBack()
    };

    render () {
        const { errors, currentPassword, newPassword, passwordConfirmation } = this.state

        return(
            <div className="static-modal">
                <Modal show={true}>
                    <Modal.Header>
                        <Modal.Title id="modal-title">Update Profile Settings</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        { errors.form && <div className="alert alert-danger">{errors.form}</div> }

                        <TextFieldGroup field="currentPassword"
                                        id="date-entry"
                                        value={currentPassword}
                                        type="password"
                                        label="Current Password"
                                        onChange={this.handleChange}
                                        error={errors.currentPassword}
                        />
                        <TextFieldGroup field="newPassword"
                                        id="date-entry"
                                        value={newPassword}
                                        type="password"
                                        label="New Password"
                                        onChange={this.handleChange}
                                        error={errors.newPassword}
                        />
                        <TextFieldGroup field="passwordConfirmation"
                                        id="date-entry"
                                        value={passwordConfirmation}
                                        type="password"
                                        label="Confirm New Password"
                                        onChange={this.handleChange}
                                        error={errors.passwordConfirmation}
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

const mapStateToProps = state => ({
  login_id: state.user.login_id
});

export default connect(mapStateToProps, { updateUser })(UserUpdateModal);