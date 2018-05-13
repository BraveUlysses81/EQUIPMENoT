import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import TextFieldGroup from '../TextFieldGroup'
import { connect } from 'react-redux'
import { updateContact, getCustomerProfile} from '../../actions/profileActions'

const contactValidation = require('../../../routes/shared/contactValidation');


class ContactModal extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        person_id: '',
        first_name: '',
        last_name: '',
        mobile: '',
        fax: '',
        username: '',
        email: '',
        phone: '',
        errors: '',
        isFetching: false,
        checkDuplicate: false
    };

    static propTypes = {
        updateContact: PropTypes.func.isRequired,
        getCustomerProfile: PropTypes.func.isRequired
    };

    componentWillMount() {
        const person_id = this.props.match.params.person_id;
        this.setState({ person_id });
        this.initContactInfo(person_id)
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
    };

    initContactInfo = (person_id) => {
        this.props.getCustomerProfile(person_id)
            .then((data) => {

                this.setState({
                    first_name: data.data.first_name,
                    last_name: data.data.last_name,
                    mobile: this.formatPhoneNumber(data.data.mobile),
                    email: data.data.customer_email,
                    phone: this.formatPhoneNumber(data.data.phone),
                    username: data.data.username,
                    fax: this.formatPhoneNumber(data.data.fax)
                })
            })
            .catch(() => {
                this.setState( {errors: {form: 'Oops! Something went wrong on detail load.' }} )
            })
    };

    isvalid = () => {
        const { errors, isValid } = contactValidation(this.state);

        if(!isValid) {
            this.setState({ errors })
        }
        return isValid
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        if(e.target.name === 'username' || e.target.name === 'email') {
            this.setState({ checkDuplicate: true })
        }
    };

    handleAccept = (e) => {
        e.stopPropagation();
        this.setState({ errors: {}, isFetching: true });

        let { mobile, phone }  = this.state;
        if(mobile){
            mobile = mobile.replace(/-/g, '');
            this.setState({ mobile });
            console.log(mobile)
        }
        if(phone){
            this.setState({ phone: phone.replace(/-/g, '') })
        }

        if(this.isvalid()) {
             this.props.updateContact(this.state)
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

    };

    handleCancel = (e) => {
        e.stopPropagation();
        this.props.history.goBack()
    };

    render () {
        const { errors, first_name, last_name, mobile, email, phone, fax, username } = this.state;

        return(
            <div className="static-modal">
                <Modal show={true}>
                    <Modal.Header>
                        <Modal.Title id="modal-title">Update Contact Info</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        { errors.form && <div className="alert alert-danger">{errors.form}</div> }

                        <TextFieldGroup field="first_name"
                                        value={first_name}
                                        label="First Name"
                                        onChange={this.handleChange}
                                        error={errors.first_name}
                        />
                        <TextFieldGroup field="last_name"
                                        value={last_name}
                                        label="Last Name"
                                        onChange={this.handleChange}
                                        error={errors.last_name}
                        />
                        <TextFieldGroup field="username"
                                        value={username}
                                        label="User Name"
                                        onChange={this.handleChange}
                                        error={errors.username}
                        />
                        <TextFieldGroup field="mobile"
                                        value={mobile}
                                        label="Mobile Number"
                                        type="tel"
                                        onChange={this.handleChange}
                                        error={errors.mobile}
                        />
                        <TextFieldGroup field="email"
                                        value={email}
                                        label="Email"
                                        onChange={this.handleChange}
                                        error={errors.email}
                        />
                        <TextFieldGroup field="phone"
                                        value={phone}
                                        label="Home Phone"
                                        type="tel"
                                        onChange={this.handleChange}
                                        error={errors.phone}
                        />
                        <TextFieldGroup field="fax"
                                        value={fax}
                                        label="Fax"
                                        type="fax"
                                        onChange={this.handleChange}
                                        error={errors.fax}
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

export default connect(null, { getCustomerProfile, updateContact })(ContactModal);