import React from 'react'
import { render } from 'react-dom'
import Collapsible from 'react-collapsible'
import FontAwesome from 'react-fontawesome'
import axios from 'axios'
import { server } from '../../helpers/serverAddress'
import PropTypes from 'prop-types'


class InstructorCertificate extends React.Component {
    state = {
        advanced_ground_instructor: false,
        basic_ground_instructor: false,
        helicopter_instructor: false,
        instrument_ground_instructor: false,
        instrument_instructor: false,
        multi_engine_instructor: false,
        single_engine_instructor: false,
        sport_pilot_instructor: false,
    };

    static propTypes = {
        instructorCert: PropTypes.object,
        refreshInstructorCerts: PropTypes.func,
        personId: PropTypes.string,
        getInstructorCertificates: PropTypes.func,
    };

    constructor(){
        super()
    }

    updateInstructorCertificate = (updatedInstructorCert) =>{
            axios.put(`${server}/instructorcertificate/${updatedInstructorCert.instructor_certificate_id}`, {
                advanced_ground_instructor: updatedInstructorCert.advanced_ground_instructor,
                basic_ground_instructor: updatedInstructorCert.basic_ground_instructor,
                helicopter_instructor: updatedInstructorCert.helicopter_instructor,
                instrument_ground_instructor: updatedInstructorCert.instrument_ground_instructor,
                instrument_instructor: updatedInstructorCert.instrument_instructor,
                multi_engine_instructor: updatedInstructorCert.multi_engine_instructor,
                single_engine_instructor: updatedInstructorCert.single_engine_instructor,
                sport_pilot_instructor: updatedInstructorCert.sport_pilot_instructor,
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                })
        this.props.getInstructorCertificates();
    };

    newInstructorCertificate = () => {
            axios.post(`${server}/instructor/instructorcertificate/${this.props.personId}`, {
                advanced_ground_instructor: this.state.advanced_ground_instructor,
                basic_ground_instructor: this.state.basic_ground_instructor,
                helicopter_instructor: this.state.helicopter_instructor,
                instrument_ground_instructor: this.state.instrument_ground_instructor,
                instrument_instructor: this.state.instrument_instructor,
                multi_engine_instructor: this.state.multi_engine_instructor,
                single_engine_instructor: this.state.single_engine_instructor,
                sport_pilot_instructor: this.state.sport_pilot_instructor,
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                })
    };

    handleChange = (e) => {
        const instructorCert = this.props.instructorCert;
        const updatedInstructorCert = {
            ...instructorCert,
            [e.target.name]: e.target.checked
        };
        this.updateInstructorCertificate(updatedInstructorCert);
    };

    handleNewChange = (e) => {
        let name = e.target.name;
        let value = e.target.checked;
        this.setState({ [name]: value })
    };

    render() {
        return(
            <div>
                { this.props.addInstructorCerts === false &&
                    (
                        <form>
                            <div className="form-group">
                                <h4 id="certificates-header">Instructor Certificates</h4>

                                <div id="certificate-checkbox-container" className="col-md-6">
                                <input id="certificate-checkbox"
                                       type="checkbox"
                                       name="basic_ground_instructor"
                                       onChange={this.handleChange}
                                       defaultChecked={this.props.instructorCert.basic_ground_instructor}
                                />
                                <label>Basic Ground Instructor</label>
                                </div>

                                <div id="certificate-checkbox-container" className="col-md-6">
                                <input id="certificate-checkbox"
                                       type="checkbox"
                                       name="advanced_ground_instructor"
                                       onChange={this.handleChange}
                                       defaultChecked={this.props.instructorCert.advanced_ground_instructor}
                                />
                                <label>Advanced Ground Instructor</label>
                                </div>
                                <br/>

                                <div id="certificate-checkbox-container" className="col-md-6">
                                <input id="certificate-checkbox"
                                       type="checkbox"
                                       name="instrument_ground_instructor"
                                       onChange={this.handleChange}
                                       defaultChecked={this.props.instructorCert.instrument_ground_instructor}
                                />
                                <label>Instrument Ground Instructor</label>
                                </div>

                                <div id="certificate-checkbox-container" className="col-md-6">
                                <input id="certificate-checkbox"
                                       type="checkbox"
                                       name="instrument_instructor"
                                       onChange={this.handleChange}
                                       defaultChecked={this.props.instructorCert.instrument_instructor}
                                />
                                <label>Instrument Instructor</label>
                                </div>
                                <br/>

                                <div id="certificate-checkbox-container" className="col-md-6">
                                <input id="certificate-checkbox"
                                       type="checkbox"
                                       name="single_engine_instructor"
                                       onChange={this.handleChange}
                                       defaultChecked={this.props.instructorCert.single_engine_instructor}
                                />
                                <label>Single Engine Instructor</label>
                                </div>

                                <div id="certificate-checkbox-container" className="col-md-6">
                                <input id="certificate-checkbox"
                                       type="checkbox"
                                       name="multi_engine_instructor"
                                       onChange={this.handleChange}
                                       defaultChecked={this.props.instructorCert.multi_engine_instructor}
                                />
                                <label>Multi Engine Instructor</label>
                                </div>
                                <br/>

                                <div id="certificate-checkbox-container" className="col-md-6">
                                <input id="certificate-checkbox"
                                       type="checkbox"
                                       name="helicopter_instructor"
                                       onChange={this.handleChange}
                                       defaultChecked={this.props.instructorCert.helicopter_instructor}
                                />
                                <label>Helicopter Instructor</label>
                                </div>

                                <div id="certificate-checkbox-container" className="col-md-6">
                                <input id="certificate-checkbox"
                                       type="checkbox"
                                       name="sport_pilot_instructor"
                                       onChange={this.handleChange}
                                       defaultChecked={this.props.instructorCert.sport_pilot_instructor}
                                />
                                <label>Sport Pilot Instructor</label>
                                </div>
                                <br/>

                            </div>
                        </form>
                    )
                }

                { this.props.addInstructorCerts === true &&
                (
                    <form>
                        <div id="certificate-form" className="form-group">
                            <h4 id="certificates-header">Instructor Certificates</h4>

                            <div id="certificate-checkbox-container" className="col-md-6">
                            <input id="certificate-checkbox"
                                   type="checkbox"
                                   name="basic_ground_instructor"
                                   onChange={this.handleNewChange}
                            />
                            <label>Basic Ground Instructor</label>
                            </div>

                            <div id="certificate-checkbox-container" className="col-md-6">
                            <input id="certificate-checkbox"
                                   type="checkbox"
                                   name="advanced_ground_instructor"
                                   onChange={this.handleNewChange}
                            />
                            <label>Advanced Ground Instructor</label>
                            </div>

                                <div id="certificate-checkbox-container" className="col-md-6">
                                    <input id="certificate-checkbox"
                                           type="checkbox"
                                           name="instrument_ground_instructor"
                                           onChange={this.handleNewChange}
                                    />
                                    <label>Instrument Ground Instructor</label>
                                </div>

                                <div id="certificate-checkbox-container" className="col-md-6">
                                    <input id="certificate-checkbox"
                                           type="checkbox"
                                           name="instrument_instructor"
                                           onChange={this.handleNewChange}
                                        />
                                    <label>Instrument Instructor</label>
                                </div>

                                <div id="certificate-checkbox-container" className="col-md-6">
                                <input id="certificate-checkbox"
                                       type="checkbox"
                                       name="single_engine_instructor"
                                       onChange={this.handleNewChange}
                                />
                                <label>Single Engine Instructor</label>
                                </div>

                                <div id="certificate-checkbox-container" className="col-md-6">
                                <input id="certificate-checkbox"
                                       type="checkbox"
                                       name="multi_engine_instructor"
                                       onChange={this.handleNewChange}
                                />
                                <label>Multi Engine Instructor</label>
                                </div>

                                <div id="certificate-checkbox-container" className="col-md-6">
                                <input id="certificate-checkbox"
                                       type="checkbox"
                                       name="helicopter_instructor"
                                       onChange={this.handleNewChange}
                                />
                                    <label>Helicopter Instructor</label>
                                </div>

                                <div id="certificate-checkbox-container" className="col-md-6">
                                <input id="certificate-checkbox"
                                       type="checkbox"
                                       name="sport_pilot_instructor"
                                       onChange={this.handleNewChange}
                                />
                                <label>Sport Pilot Instructor</label>
                                </div>

                        </div>
                        <br/>


                        <button id="pilot-certificate-save-btn"
                                className="btn btn-primary"
                                type="button"
                                onClick={() => {this.newInstructorCertificate(); this.props.refreshInstructorCerts()}}
                        >
                            Save
                        </button>
                    </form>
                )
                }
            </div>
        )
    }
}

export default InstructorCertificate;