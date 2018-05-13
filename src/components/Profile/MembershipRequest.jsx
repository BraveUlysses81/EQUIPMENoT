import React, { Component } from 'react';
import { Modal, Button, ControlLabel, Checkbox } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getNonMemberSchools, requestNewMembership } from '../../actions/profileActions';
import classnames from 'classnames';

class MembershipRequest extends Component {
    state = {
        errors: '',
        isFetching: true,
        school_id: '',
        schools: [],
        agreement_signed: ''
    }

    componentWillMount() {
        const person_id = this.props.match.params.person_id;

        this.props.getNonMemberSchools(person_id)
            .then((data) => {
                data.data.map((i) => {

                    const schools = {...this.state.schools} //create a copy of the checkout state
                    schools[`s-${i.school_id}`] = i // add the checkout to the checkout copy
                    this.setState({ schools }) //call set state with the updated copy
                })
            })
            .catch(() => {
                this.setState( {errors: {form: 'Oops! Something went wrong.' }} )
            })
    }

    onChange = (e) => {
        //clear errors
        this.setState({ errors: ''});
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });

        //if agreement is checked then enable send button
        if(name === 'agreement_signed') {
            this.setState({ isFetching: false })
        }
    }

    handleAccept = () => {
        const { school_id, agreement_signed } = this.state;
        const person_id = this.props.match.params.person_id;

        if(!school_id) {
            this.setState({ errors: {school_id: 'Please Select a School'}})
        }else if(!agreement_signed) {
            this.setState({ errors: {agreement_signed: 'Please agree to the schools terms of service'}})
        } else {
            this.setState({isFetching: true})
            this.props.requestNewMembership(person_id, school_id, this.state)
                .then(() => {
                    this.props.history.goBack()
                })
                .catch(() => {
                    this.setState( {errors: {form: 'Oops! Something went wrong on membership request.' }, isFetching: false} )
                })
        }
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.props.history.goBack();
    }

    render() {
        const { errors, schools, school_id } = this.state

        const schoolsArray = Object.keys(schools)
            .map(key => <option key={key} value={schools[key].school_id}>{`${schools[key].school_name}`}</option>
            )

        return (
            <div>
                <Modal show={true}>
                    <Modal.Header>
                        <Modal.Title>Request New School Membership</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={ classnames("form-group", {'has-error': errors.form})}>
                            {
                                errors.form ? (
                                <span id="textfieldgroup-error" className="help-block">{errors.form }</span>) : (
                                <span id="textfieldgroup-error-none"/>)
                            }
                        </div>
                        <div className={ classnames("form-group", {'has-error': errors.school_id})}>
                            <ControlLabel
                            >
                                Pick a School to request a new membership:
                            </ControlLabel>
                            <select
                                id="signup-register-school-select"
                                className="form-control"
                                name="school_id"
                                onChange={this.onChange}
                                value={school_id}

                            >
                                <option
                                    value=''
                                    disabled
                                    default={true}
                                >
                                    Select School
                                </option>

                                {/*Lists the School Options For Registering*/}
                                {schoolsArray}
                            </select>
                            {
                                errors.school_id &&
                                (<span id="textfieldgroup-error" className="help-block">{errors.school_id}</span>)
                            }
                        </div>
                        {
                            school_id && (
                                <div className={ classnames("form-group", {'has-error': errors.agreement_signed})}>
                                    <ControlLabel >Rental agreement</ControlLabel>
                                    <Checkbox name="agreement_signed" onChange={this.onChange}>
                                        Agree to terms of service
                                    </Checkbox>

                                    { errors.agreement_signed ? (<span id="textfieldgroup-error"
                                                                       className="help-block">{errors.agreement_signed }</span>) : (
                                        <span id="textfieldgroup-error-none"/>)
                                    }
                                </div>
                            )
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleCancel}>Cancel</Button>
                        <Button bsStyle="primary" disabled={this.state.isFetching}
                                onClick={this.handleAccept}>Send Request</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default connect(null, { getNonMemberSchools, requestNewMembership })(MembershipRequest);