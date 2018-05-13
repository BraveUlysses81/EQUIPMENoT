import React from 'react'
import { render } from 'react-dom'
import Collapsible from 'react-collapsible'
import FontAwesome from 'react-fontawesome'
import axios from 'axios'
import { server } from '../../helpers/serverAddress'
import AddPilotCertificate from './AddPilotCertificate'
import InstructorCertificate from './InstructorCertificate'


class PilotCertificateContainer extends React.Component {
    state = {
        canEditPilotCerts: false,
        addNewCertificate: false,
        addEndorsements: false,
        pilotCerts: {},
        instructorCert: {},
        addInstructorCerts: false,
        editMedical: false,
    };

    constructor() {
        super()
    }

    getPilotCertificate() {
        this.setState({pilotCerts: []});
        axios.get(`${server}/pilot/pilot_certificate/${this.props.personId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                }
            })
            .then((data) => {
                data.data.map((i) => {
                    const pilotCerts = {...this.state.pilotCerts};
                    pilotCerts[`pilotCerts-${i.pilot_certificate_id}`] = i;
                    this.setState({
                        pilotCerts: pilotCerts
                    })
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    getInstructorCertificates() {
        this.setState({ instructorCert: {} });
        axios.get(`${server}/instructor/instructorcertificate/${this.props.personId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                }
            })
            .then((data) => {
            const instructorCert = data.data;
            this.setState({ instructorCert })
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    componentWillMount() {
        this.getPilotCertificate();
        this.getInstructorCertificates();
    }

    addCertificate = () =>{
        this.setState({addNewCertificate: true})
    };

    closeAddCertificates= () => {
        this.setState({addNewCertificate: false})
    };

    addInstructorCerts = () => {
        this.setState({addInstructorCerts: true})
    };

    refreshInstructorCerts = () => {
        this.setState({addInstructorCerts: false});
        this.getInstructorCertificates();
    };



    handleChange = (e) => {
        let pilotCertKey = e.target.getAttribute('data-id');
        const selectedCert = this.state.pilotCerts[pilotCertKey];
        const updatedCert = {
            ...selectedCert,
            [e.target.name]: e.target.checked
        };
        this.saveEndorsements(updatedCert);
    };

    saveEndorsements = (updatedCert) => {
        axios.put(`${server}/pilotcertificate/endorsements/${updatedCert.pilot_certificate_id}`, {
            instrument_rating: updatedCert.instrument_rating,
            high_performance: updatedCert.high_performance,
            complex: updatedCert.complex,
            tailwheel: updatedCert.tailwheel,
            high_altitude: updatedCert.high_altitude,
            nvg: updatedCert.nvg,
            external_load: updatedCert.external_load,
            aero_tow: updatedCert.aero_tow,
            winch_launch: updatedCert.winch_launch
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            })
        this.getPilotCertificate();
    };

    renderPilotCertificates = (key) => {
        const pilotCert = this.state.pilotCerts[key];

        return(
            <div key={key}>

                <h4 id="certificates-header">Certificate</h4>

                <span id="certificate-span">{pilotCert.category}</span>
                <span id="certificate-class">{pilotCert.class}</span>
                <span id="certificate-class">{pilotCert.certificate_type}</span>

                <br/>
                <br/>

                {
                    pilotCert.category === "Airplane" &&
                    (
                        <div>

                        <div id="certificate-checkbox-container" className="col-md-6">
                            <input id="certificate-checkbox"
                                   type="checkbox"
                                   data-id={key}
                                   name="instrument_rating"
                                   onChange={this.handleChange}
                                   defaultChecked={pilotCert.instrument_rating}
                            />
                            <label>Instrument Rating</label>
                        </div>

                        <div  id="certificate-checkbox-container" className="col-md-6">
                            <input id="certificate-checkbox"
                                   type="checkbox"
                                   data-id={key}
                                   name="high_performance"
                                   onChange={this.handleChange}
                                   defaultChecked={pilotCert.high_performance}
                            />
                            <label>High Performance</label>
                        </div>
                            <br/>

                        <div  id="certificate-checkbox-container" className="col-md-6">
                            <input id="certificate-checkbox"
                                   type="checkbox"
                                   data-id={key}
                                   name="complex"
                                   onChange={this.handleChange}
                                   defaultChecked={pilotCert.complex}
                            />
                            <label>Complex</label>
                        </div>

                        <div id="certificate-checkbox-container" className="col-md-6">
                            <input id="certificate-checkbox"
                                   type="checkbox"
                                   data-id={key}
                                   name="tailwheel"
                                   onChange={this.handleChange}
                                   defaultChecked={pilotCert.tailwheel}
                            />
                            <label>Tailwheel</label>
                        </div>
                            <br/>

                        <div id="certificate-checkbox-container" className="col-md-6">
                            <input id="certificate-checkbox"
                                   type="checkbox"
                                   data-id={key}
                                   name="high_altitude"
                                   onChange={this.handleChange}
                                   defaultChecked={pilotCert.high_altitude}
                            />
                            <label>High Altitude</label>
                        </div>

                        <div id="certificate-checkbox-container" className="col-md-6">
                            <input id="certificate-checkbox"
                                   type="checkbox"
                                   data-id={key}
                                   name="nvg"
                                   onChange={this.handleChange}
                                   defaultChecked={pilotCert.nvg}
                            />
                            <label>NVG</label>
                        </div>
                            <br/>

                        </div>
                    )
                }

                {
                    pilotCert.category === "Rotocraft" &&
                    (
                        <div>

                    <div id="certificate-checkbox-container" className="col-md-6">
                        <input id="certificate-checkbox"
                               type="checkbox"
                               data-id={key}
                               name="instrument_rating"
                               onChange={this.handleChange}
                               defaultChecked={pilotCert.instrument_rating}
                        />
                        <label>Instrument Rating</label>
                    </div>

                    <div id="certificate-checkbox-container" className="col-md-6">
                        <input id="certificate-checkbox"
                               type="checkbox"
                               data-id={key}
                               name="external_load"
                               onChange={this.handleChange}
                               defaultChecked={pilotCert.external_load}
                        />
                        <label>External Load</label>
                    </div>
                            <br/>

                            <div id="certificate-checkbox-container" className="col-md-6">
                                <input id="certificate-checkbox"
                                       type="checkbox"
                                       data-id={key}
                                       name="nvg"
                                       onChange={this.handleChange}
                                       defaultChecked={pilotCert.nvg}
                                />
                                <label>NVG</label>
                            </div>
                            <br/>

                        </div>
                    )
                }

                {
                    pilotCert.category === "Glider" &&
                    (
                        <div>

                        <div id="certificate-checkbox-container" className="col-md-6">
                            <input id="certificate-checkbox"
                                   type="checkbox"
                                   data-id={key}
                                   name="aero_tow"
                                   onChange={this.handleChange}
                                   defaultChecked={pilotCert.aero_tow}
                            />
                            <label>Aero Tow</label>
                        </div>

                        <div id="certificate-checkbox-container" className="col-md-6">
                            <input id="certificate-checkbox"
                                   type="checkbox"
                                   data-id={key}
                                   name="winch_launch"
                                   onChange={this.handleChange}
                                   defaultChecked={pilotCert.winch_launch}
                            />
                            <label>Winch Launch</label>
                        </div>
                            <br/>

                        </div>
                    )
                }

            </div>
        )
    };

    render() {
        return (

            <div>

                <button id="pilot-certificate-new-btn"
                        type="button"
                        // hidden={!this.state.canEditPilotCerts}
                        className="addCertificates btn btn-primary"
                        onClick={ () => this.addCertificate() }
                >
                    New Certificate
                </button>

                { !this.state.instructorCert.instructor_certificate_id &&
                    (
                    <button id="pilot-certificate-new-btn"
                            type="button"
                            // hidden={!this.state.canEditPilotCerts}
                            className="addCertificates btn btn-primary"
                            onClick={ () => this.addInstructorCerts() }
                    >
                        New Instructor Certificate
                    </button>
                    )
                }

                {
                    this.state.addNewCertificate === true &&
                        <AddPilotCertificate personId={this.props.personId}
                                             closeAddCertificates={this.closeAddCertificates}
                                             instructorCertId={this.state.instructorCert.instructor_certificate_id}
                                             instructorCert={this.state.instructorCert}
                        />
                }

                <div>
                    {
                        Object.keys(this.state.pilotCerts).map(this.renderPilotCertificates)
                    }
                </div>
                { (this.state.instructorCert.instructor_certificate_id || this.state.addInstructorCerts === true) &&
                    (
                       <InstructorCertificate instructorCert={this.state.instructorCert}
                                              addInstructorCerts={this.state.addInstructorCerts}
                                              refreshInstructorCerts={this.refreshInstructorCerts}
                                              personId={this.props.personId}
                                              getInstructorCertificates={this.getInstructorCertificates}
                       />
                    )
                }

            </div>
        )
    }
}

export default PilotCertificateContainer;