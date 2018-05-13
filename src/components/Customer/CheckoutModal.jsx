import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import axios from 'axios'
import { server } from '../../helpers/serverAddress'
import dateFormat from 'dateformat'
import { connect } from 'react-redux';


class CheckoutModal extends React.Component {
    state = {
        checkouts: {},
        membershipId: "",
        studentSolo: {},
        ifrCheck: false,

        newCheckout: false,
        currency_end_date: "",
        ifr_checkout: false,
        newCheckoutAircraft: "",
        newSolo: false,
        student_endorsement_end_date: "",
        newSoloAircraft: "",




    }



    constructor(){
        super()
    }

    getCheckouts = (membershipid) => {
        axios.get(`${server}/membership/checkouts/${membershipid}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }})
            .then( (data) => {
                data.data.map((i) => {
                    const checkouts = {...this.state.checkouts};
                    checkouts[`checkout-${i.checkout_id}`] = i;
                    this.setState({ checkouts })
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    getStudentSolo = (membershipId) =>{
        this.setState({ studentSolo: {} });
        axios.get(`${server}/member/studentendorsements/${membershipId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
            .then((data) => {
                data.data.map((i) => {
                    const studentSolo = {...this.state.studentSolo};
                    studentSolo[`studentSolo-${i.student_endorsement_id}`] = i;
                    this.setState({ studentSolo: studentSolo})
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    getAircraft = () =>{
        this.setState({ aircrafts: {} });
        axios.get(`${server}/schools/aircraft/${this.props.schoolId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
            .then((data) => {
                data.data.map((i) => {
                    const aircrafts = {...this.state.aircrafts};
                    aircrafts[`aircraft-${i.aircraft_id}`] = i;
                    this.setState({ aircrafts: aircrafts})
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    formatDates = (date) => {
        if(date){
            return (dateFormat(date, 'isoDate'))
        } else {
            return('')
        }
    };

    componentWillMount(){
        const membershipId = this.props.match.params.membershipid;
        this.setState({ membershipId });
        this.getCheckouts(membershipId);
        this.getStudentSolo(membershipId);
        this.getAircraft();
    }

    handleCheckout = (e) =>{
        let checkoutKey = e.target.getAttribute('data-id');
        const selectedCheckout = this.state.checkouts[checkoutKey];
        let name = e.target.name;
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        const updatedCheckout = {
            ...selectedCheckout,
            [name]: value
        };
        this.updateCheckoutDate(updatedCheckout);
        this.getCheckouts(this.state.membershipId);

    };

    handleStudentSolo = (e) =>{
        let soloKey = e.target.getAttribute('data-id');
        const selectedSolo = this.state.studentSolo[soloKey];
        const updatedSolo = {
            ...selectedSolo,
            [e.target.name]: e.target.value
        };
        this.updateStudentSolo(updatedSolo);
        this.getStudentSolo(this.state.membershipId);
    };

    updateStudentSolo = (updatedSolo) =>{
        let newEndDate = new Date(updatedSolo.student_endorsement_end_date);
        axios.put(`${server}/member/studentendorsement/${this.state.membershipId}/${updatedSolo.aircraft_id}`, {
            student_endorsement_end_date: newEndDate
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            })
    };

    updateCheckoutDate = (updatedCheckout) => {
        let newEndDate = new Date(updatedCheckout.currency_end_date);
        axios.put(`${server}/checkout/${this.state.membershipId}/${updatedCheckout.aircraft_id}`, {
            currency_end_date: newEndDate,
            ifr_checkout: updatedCheckout.ifr_checkout
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            })
        this.getCheckouts(this.state.membershipId);

    };

    renderCheckouts = (key) =>{
        const checkout = this.state.checkouts[key];

        return(
            <div key={key}>
                <div className="row">
                <div className="col-sm-2">
                    <span id="checkout-reg-span">{checkout.registration_nbr}</span>
                </div>

            <div className="col-sm-7">
                <span><label id="checkout-date-label">Currency End Date:
                <input type="date"
                       id="checkout-date-input"
                       name="currency_end_date"
                       value={this.formatDates(checkout.currency_end_date)}
                       onChange={this.handleCheckout}
                       data-id={key}
                /></label></span>
            </div>

            <div className="col-sm-3">
                <span>
                <input type="checkbox"
                       id="checkout-checkbox"
                       name="ifr_checkout"
                       value={checkout.ifr_checkout}
                       onChange={this.handleCheckout}
                       data-id={key}
                /><label id="checkout-date-label"> IFR Checkout</label></span>
            </div>

                </div>
                <br/>
            </div>
        )
    };

    renderStudentSolo = (key) =>{
        const studentSoloEndorsement = this.state.studentSolo[key];

        return(
            <div key={key}>
                <div className="row">
                <div className="col-sm-2">
                <span id="checkout-reg-span">{studentSoloEndorsement.registration_nbr}</span>
            </div>
            <div className="col-sm-7">
                  <span><label id="checkout-date-label"> Solo Expire Date:
                <input type="date"
                       id="checkout-date-input"
                       name="student_endorsement_end_date"
                       value={this.formatDates(studentSoloEndorsement.student_endorsement_end_date)}
                       onChange={this.handleStudentSolo}
                       data-id={key}
                /></label></span>
            </div>
                </div>
                <br/>

            </div>
        )
    };


    addNewCheckout = () =>{
        this.setState({ newCheckout: true })
    }
    closeNewCheckout = () =>{
        this.setState({ newCheckout: false })
        this.getCheckouts(this.state.membershipId)
    }

    renderNewCheckout = () =>{
        return(
            <div>
                <select name="newCheckoutAircraft"
                >
                </select>
            </div>
        )
    };


    handleCancel = (e) => {
        e.stopPropagation();
        this.props.history.goBack()

    }
    handleNewCheckout = (e) => {
        e.preventDefault();
        let name = e.target.name;
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({
            [name]: value,

        })
    }
    saveNewCheckout = (e) =>{
        e.preventDefault();
        axios.post(`${server}/checkout/newcheckout/${this.state.membershipId}`, {
            membership_id: this.state.membershipId,
            currency_end_date: this.state.currency_end_date,
            aircraft_id: this.state.newCheckoutAircraft,
            ifr_checkout: this.state.ifr_checkout,
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            })

        // this.renderCheckouts(key);
        this.closeNewCheckout();
    }

    addNewSolo = () =>{
        this.setState({ newSolo: true })
    }
    closeNewSolo = () =>{
        this.setState({ newSolo: false })
        this.getStudentSolo(this.state.membershipId);
    }


    handleNewSolo = (e) => {
        e.preventDefault();
        let name = e.target.name;
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({
            [name]: value,

        })
    }

    saveNewSolo = (e) =>{
        e.preventDefault();
        axios.post(`${server}/member/studentendorsements/${this.state.membershipId}`, {
            membership_id: this.state.membershipId,
            student_endorsement_end_date: this.state.student_endorsement_end_date,
            aircraft_id: this.state.newSoloAircraft,
            instructor_id: this.props.instructorId,
            student_solo: true,
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            })

        // this.renderCheckouts(key);
        this.closeNewSolo();
    }


    render(){

        const aircraftArray = Object.keys(this.state.aircrafts)
            .map(key => <option key={key}

                                value={this.state.aircrafts[key].aircraft_id}
            > {this.state.aircrafts[key].registration_nbr}</option>)


        return(
            <div className="static-modal">
                <Modal show={true}>
                    <Modal.Header>
                        {/*<span id="closemodal" onClick={back} ><FontAwesome name='times' /></span>*/}
                        <Modal.Title id="modal-title">Checkouts & Endorsements</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4 id="certificates-header">Checkouts</h4>
                        <div id="checkouts-object-container">
                            {
                                Object.keys(this.state.checkouts).map(this.renderCheckouts)
                            }
                        </div>

                        {!this.state.newCheckout &&
                            (
                            <Button onClick={this.addNewCheckout}
                            >Add New Checkout</Button>
                            )
                        }
                        {this.state.newCheckout &&
                            (
                                <Button onClick={this.saveNewCheckout}
                                >Save</Button>
                            )
                        }
                        {this.state.newCheckout &&
                            (


                                <div className="row">
                                <div className="col-sm-4">
                                    <select name="newCheckoutAircraft"
                                            onChange={this.handleNewCheckout}

                                    >
                                        <option>Choose Aircraft...</option>
                                        {aircraftArray}
                                    </select>
                                </div>
                                    <div className="col-sm-4">
                                    <label> Currency End Date:
                                        <input type="date"
                                               name="currency_end_date"
                                               onChange={this.handleNewCheckout}

                                        /></label>
                                </div>
                                    <div className="col-sm-4">
                                    <label> IFR Checkout:
                                        <input type="checkbox"
                                               name="ifr_checkout"
                                               onChange={this.handleNewCheckout}

                                        /></label>
                                    </div>
                                </div>



                            )
                        }

                        <h4 id="certificates-header">Student Solo Endorsement</h4>

                        <div>
                            {
                                Object.keys(this.state.studentSolo).map(this.renderStudentSolo)
                            }
                        </div>
                        {!this.state.newSolo &&
                        (
                            <Button onClick={this.addNewSolo}
                            >Add New Student Solo</Button>
                        )
                        }
                        {this.state.newSolo &&
                        (
                            <Button onClick={this.saveNewSolo}
                            >Save</Button>
                        )
                        }
                        {this.state.newSolo &&
                        (


                            <div className="row">
                                <div className="col-sm-4">
                                    <select name="newSoloAircraft"
                                            onChange={this.handleNewSolo}

                                    >
                                        <option>Choose Aircraft...</option>
                                        {aircraftArray}
                                    </select>
                                </div>
                                <div className="col-sm-4">
                                    <label> Currency End Date:
                                        <input type="date"
                                               name="student_endorsement_end_date"
                                               onChange={this.handleNewSolo}

                                        /></label>
                                </div>

                            </div>



                        )
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleCancel}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        schoolId: state.member.school_id,
        instructorId: state.user.person_id
    }
};

export default connect(mapStateToProps)(CheckoutModal);