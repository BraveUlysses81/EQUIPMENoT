import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { instructorQuickAddRequest } from '../../actions/instructorActions';
import TextFieldGroup from '../TextFieldGroup';

const validateInput = require('../../../routes/shared/quickAddValidation');

class AddInstructor extends React.Component {

    state = {
        first_name: '',
        last_name: '',
        mobile: '',
        membership_type: 'instructor',
        errors: '',
        isFetching: ''
    };

    constructor(props) {
        super(props)
    }

    static propTypes = {
        school_id: PropTypes.number.isRequired,
        instructorQuickAddRequest: PropTypes.func.isRequired
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };

    isvalid = () => {
        const { errors, isValid } = validateInput(this.state)

        if(!isValid) {
            this.setState({ errors })
        }

        return isValid
    };

    onSubmit = (e) => {

        e.preventDefault();

        const { school_id } = this.props;

        this.setState({ errors: {}, isFetching: true });

        if(this.isvalid()) {
            this.props.instructorQuickAddRequest(this.state, school_id)
                .then(
                    () => {
                        this.context.router.history.push('/instructors');
                    })
                .catch((err) => {
                    if (err.response) {
                        this.setState({errors: err.response.data, isFetching: false})
                    } else {
                        this.setState({errors: {form: 'Oops! Something went wrong.' }, isFetching: false})
                    }
                })
        }
    };

    render() {
        const { errors } = this.state

        return (
            <div id="add-customer-container">

                <form onSubmit={this.onSubmit} >
                    <h2>Quick Add Instructor Form</h2>

                    { errors.form && <div className="alert alert-danger">{errors.form}</div> }

                    <TextFieldGroup
                        inputId="add-customer-first"
                        field="first_name"
                        value={this.state.first_name}
                        label="First Name"
                        onChange={this.onChange}
                        error={errors.first_name}
                    />

                    <TextFieldGroup
                        field="last_name"
                        value={this.state.last_name}
                        label="Last Name"
                        onChange={this.onChange}
                        error={errors.last_name}
                    />

                    <TextFieldGroup
                        field="mobile"
                        value={this.state.mobile}
                        label="Mobile Phone"
                        onChange={this.onChange}
                        error={errors.mobile}
                    />

                    <label
                        id="form-label-certificate_desc"
                        className="control-label"
                    >
                        Membership Type
                    </label>
                    <TextFieldGroup
                        field="membership_type"
                        className="form-control"
                        onChange={this.onChange}
                        value={this.state.membership_type}
                        readOnly={true}
                    />

                    <div className="form-group">
                        <button id="add-Customer-button"
                                disabled={this.state.isLoading}
                                className="btn btn-primary btn-lg"
                        >Add</button>
                    </div>
                </form>
                <div>
                    <p>*Upon submission instructor is sent an SMS invite to join the EQUIP.ME.NoT system.</p>
                </div>
            </div>
        )
    }
}

AddInstructor.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    school_id: state.member.school_id
});

export default connect(mapStateToProps, { instructorQuickAddRequest })(AddInstructor);