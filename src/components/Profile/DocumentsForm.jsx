import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import dateFormat from 'dateformat'
import axios from 'axios'
import { server } from '../../helpers/serverAddress'


class DocumentsForm extends React.Component {
    state = {
        documents:{},
        medical_class: "",
        medical_date: "",
        faa_written_test_exp: "",
        firc: "",
        photo_id: false,
        birth_certificate: false,
        guardian_release_form: false,
        rental_agreement: false,
        renters_insurance: false,
        passport: false,
        tsa_endorsement: false,
        background_check: false,
    };
    constructor() {
        super()
    }

    static propTypes = {
        personId: PropTypes.string,
    };

    formatDates = (date) => {
        if(date){
            return (dateFormat(date, 'isoDate'))
        } else {
            return('')
        }
    };

    getDocuments = () => {
        axios.get(`${server}/membership/documents/${this.props.personId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }})
            .then( (data) =>{
                const documents = data.data;
                this.setState({
                    documents: documents[0],
                    medical_class: documents[0].medical_class,
                    medical_date: this.formatDates(documents[0].medical_date),
                    faa_written_test_exp: this.formatDates(documents[0].faa_written_test_exp),
                    firc: this.formatDates(documents[0].firc),
                    photo_id: documents[0].photo_id,
                    birth_certificate: documents[0].birth_certificate,
                    guardian_release_form: documents[0].guardian_release_form,
                    rental_agreement: documents[0].rental_agreement,
                    renters_insurance: documents[0].renters_insurance,
                    passport: documents[0].passport,
                    tsa_endorsement: documents[0].tsa_endorsement,
                    background_check: documents[0].background_check, })
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    saveDocuments = (e) => {
        e.preventDefault();
        if(this.state.firc !== "") {
            axios.put(`${server}/documentation/${this.props.personId}`, {
                medical_class: this.state.medical_class,
                medical_date: this.state.medical_date,
                rental_agreement: this.state.rental_agreement,
                faa_written_test_exp: this.state.faa_written_test_exp,
                renters_insurance: this.state.renters_insurance,
                guardian_release_form: this.state.guardian_release_form,
                photo_id: this.state.photo_id,
                passport: this.state.passport,
                birth_certificate: this.state.birth_certificate,
                tsa_endorsement: this.state.tsa_endorsement,
                background_check: this.state.background_check,
                firc: this.state.firc,
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                })
        } else {
            axios.put(`${server}/documentation/${this.props.personId}`, {
                medical_class: this.state.medical_class,
                medical_date: this.state.medical_date,
                rental_agreement: this.state.rental_agreement,
                faa_written_test_exp: this.state.faa_written_test_exp,
                renters_insurance: this.state.renters_insurance,
                guardian_release_form: this.state.guardian_release_form,
                photo_id: this.state.photo_id,
                passport: this.state.passport,
                birth_certificate: this.state.birth_certificate,
                tsa_endorsement: this.state.tsa_endorsement,
                background_check: this.state.background_check,
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    };

    componentWillMount() {
        this.getDocuments();
    }

    handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({ [name]: value })
    };

    render() {
        return(
            <div>
                <div className="col-md-6">
                <form id="certificate-form">
                    <div className="form-group">
                        <label>Medical Class</label>
                        <select name="medical_class"
                                id="category-select"
                                className="form-control"
                                value={this.state.medical_class}
                                onChange={this.handleChange}>
                            <option>Choose Medical Class...</option>
                            <option value="one">Class 1</option>
                            <option value="two">Class 2</option>
                            <option value="three">Class 3</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Medical Exam Date</label>
                        <br/>
                        <input type="date"
                               id="date-entry"
                               value={this.state.medical_date}
                               name="medical_date"
                               onChange={this.handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Written Test Expiration Date</label>
                        <br/>
                        <input type="date"
                               id="date-entry"
                               value={this.state.faa_written_test_exp}
                               name="faa_written_test_exp"
                               onChange={this.handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>FIRC Date</label>
                        <br/>
                        <input type="date"
                               id="date-entry"
                               value={this.state.firc}
                               name="firc"
                               onChange={this.handleChange}
                        />
                    </div>
                    <br/>

                    <div>
                        <button type="button"
                                id="pilot-document-save-btn"
                                className="btn btn-primary"
                                onClick={(e) => this.saveDocuments(e)}
                        >Save</button>
                    </div>

                </form>
                </div>

                <div id="documents-form-checkboxes" className="col-md-6">
                    <form>
                        <div className="form-group">
                            <input type="checkbox"
                                   id="certificate-checkbox"
                                   checked={this.state.photo_id}
                                   name="photo_id"
                                   onChange={this.handleChange}
                            />
                             <label>Photo ID</label>
                        </div>

                        <div className="form-group">
                            <input type="checkbox"
                                   id="certificate-checkbox"
                                   checked={this.state.birth_certificate}
                                   name="birth_certificate"
                                   onChange={this.handleChange}
                            />
                             <label>Background Check</label>
                        </div>

                        <div className="form-group">
                            <input type="checkbox"
                                   id="certificate-checkbox"
                                   checked={this.state.guardian_release_form}
                                   name="guardian_release_form"
                                   onChange={this.handleChange}
                            />
                             <label>Guardian Release Form</label>
                        </div>

                        <div className="form-group">
                            <input type="checkbox"
                                   id="certificate-checkbox"
                                   checked={this.state.rental_agreement}
                                   name="rental_agreement"
                                   onChange={this.handleChange}
                            />
                             <label>Rental Agreement</label>
                        </div>

                        <div className="form-group">
                            <input type="checkbox"
                                   id="certificate-checkbox"
                                   checked={this.state.passport}
                                   name="passport"
                                   onChange={this.handleChange}
                            />
                             <label>Passport</label>
                        </div>

                        <div className="form-group">
                            <input type="checkbox"
                                   id="certificate-checkbox"
                                   checked={this.state.renters_insurance}
                                   name="renters_insurance"
                                   onChange={this.handleChange}
                            />
                             <label>Renters Insurance</label>
                        </div>

                        <div className="form-group">
                            <input type="checkbox"
                                   id="certificate-checkbox"
                                   checked={this.state.tsa_endorsement}
                                   name="tsa_endorsement"
                                   onChange={this.handleChange}
                            />
                             <label>TSA Endorsement</label>
                        </div>
                    </form>
                    <br/>

                </div>
            </div>
        )
    }
}

export default DocumentsForm;