import React from 'react'
import { render } from 'react-dom'
import FontAwesome from 'react-fontawesome'
import axios from 'axios'
import { server } from '../../helpers/serverAddress'
import PropTypes from 'prop-types'

class AddPilotCertificate extends React.Component {
    state={
        category: "",
        certificateClass: null,
        certificateType: "",
        instrument_rating: false,
        high_performance: false,
        high_altitude: false,
        complex: false,
        tailwheel: false,
        nvg: false,
        external_load: false,
    };
    static propTypes = {
        instructorCertId: PropTypes.number,
        instructorCert: PropTypes.object,

    };

    addAirplane = () =>{
        return (
            <div>
                <form id="certificate-form">

                    <div className="form-group">
                        <label>Class</label>
                        <select name="certificateClass"
                                className="form-control"
                                id="category-select"
                                value={this.state.certificateClass}
                                onChange={this.handleChange}>
                            <option>Choose Class...</option>
                            <option value="Single Engine Land">Single Engine Land</option>
                            <option value="Multiengine Land">Multi Engine Land</option>
                            <option value="Single Engine Sea">Single Engine Sea</option>
                            <option value="Multi Engine Sea">Multi Engine Sea</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Certificate Type</label>
                        <select name="certificateType"
                                className="form-control"
                                id="category-select"
                                value={this.state.certificateType}
                                onChange={this.handleChange}>
                            <option>Choose Certificate Type...</option>
                            <option value="student">Student</option>
                            <option value="sport">Sport</option>
                            <option value="private">Private</option>
                            <option value="commercial">Commercial</option>
                            <option value="airline_transport_pilot">ATP</option>
                        </select>
                    </div>
                    <br/>

                    <div className="form-group">
                        <h4 id="certificates-header">Endorsements</h4>

                        <div  id="certificate-checkbox-container" className="col-md-6">
                        <input type="checkbox"
                               name="instrument_rating"
                               onChange={this.handleChange}
                               id="certificate-checkbox"
                        />
                        <label>Instrument Rating</label>
                        </div>

                        <div  id="certificate-checkbox-container" className="col-md-6">
                        <input type="checkbox"
                               name="high-perfoamnce"
                               onChange={this.handleChange}
                               id="certificate-checkbox"
                        />
                        <label>High Performance</label>
                        </div>
                        <br/>

                        <div  id="certificate-checkbox-container" className="col-md-6">
                        <input type="checkbox"
                               name="complex"
                               onChange={this.handleChange}
                               id="certificate-checkbox"
                        />
                        <label>Complex</label>
                        </div>

                        <div  id="certificate-checkbox-container" className="col-md-6">
                        <input type="checkbox"
                               name="high_altitude"
                               onChange={this.handleChange}
                               id="certificate-checkbox"
                        />
                        <label>High Altitude</label>
                        </div>
                        <br/>

                        <div  id="certificate-checkbox-container" className="col-md-6">
                        <input type="checkbox"
                               name="tailwheel"
                               onChange={this.handleChange}
                               id="certificate-checkbox"
                        />
                        <label>Tailwheel</label>
                        </div>

                        <div  id="certificate-checkbox-container" className="col-md-6">
                        <input type="checkbox"
                               name="nvg"
                               onChange={this.handleChange}
                               id="certificate-checkbox"
                        />
                        <label>NVG</label>
                        </div>
                        <br/>

                    </div>

                </form>
            <br/>
            </div>
        )
    };

    addRotocraft = () =>{
        return (
            <div>
                <form id="certificate-form">

                    <div className="form-group">
                        <label>Class</label>
                        <select name="certificateClass"
                                className="form-control"
                                id="category-select"
                                value={this.state.certificateClass}
                                onChange={this.handleChange}>
                            <option>Choose Class...</option>
                            <option value="Gyroplane">Gyroplane</option>
                            <option value="Helicopter">Helicopter</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Certificate Type</label>
                        <select name="certificateType"
                                className="form-control"
                                id="category-select"
                                value={this.state.certificateType}
                                onChange={this.handleChange}>
                            <option>Choose Certificate Type...</option>
                            <option value="student">Student</option>
                            <option value="sport">Sport</option>
                            <option value="private">Private</option>
                            <option value="commercial">Commercial</option>
                            <option value="airline_transport_pilot">ATP</option>
                        </select>
                    </div>
                    <br/>

                    <div className="form-group">
                        <h4 id="certificates-header">Endorsements</h4>

                        <div  id="certificate-checkbox-container" className="col-md-6">
                        <input type="checkbox"
                               name="instrument_rating"
                               onChange={this.handleChange}
                               id="certificate-checkbox"
                        />
                        <label>Instrument Rating</label>
                        </div>

                        <div  id="certificate-checkbox-container" className="col-md-6">
                            <input type="checkbox"
                                   name="external_load"
                                   onChange={this.handleChange}
                                   id="certificate-checkbox"
                            />
                        <label>External Load</label>
                        </div>
                        <br/>

                        <div  id="certificate-checkbox-container" className="col-md-6">
                            <input type="checkbox"
                                   name="nvg"
                                   onChange={this.handleChange}
                                   id="certificate-checkbox"
                            />
                        <label>NVG</label>
                        </div>
                        <br/>

                    </div>
                </form>
                <br/>

            </div>
        )
    };

    addPoweredLift = () =>{
        return (
            <div>
                <form id="certificate-form">
                    <div className="form-group">
                        <label>Certificate Type</label>
                        <select name="certificateType"
                                className="form-control"
                                id="category-select"
                                value={this.state.certificateType}
                                onChange={this.handleChange}>
                            <option>Choose Certificate Type...</option>
                            <option value="student">Student</option>
                            <option value="sport">Sport</option>
                            <option value="private">Private</option>
                            <option value="commercial">Commercial</option>
                            <option value="airline_transport_pilot">ATP</option>
                        </select>
                    </div>
                </form>
                <br/>
            </div>
        )
    };

    addLighterThanAir = () =>{
        return (
            <div>
                <form id="certificate-form">
                    <div className="form-group">
                        <label>Class</label>
                        <select name="certificateClass"
                                className="form-control"
                                id="category-select"
                                value={this.state.certificateClass}
                                onChange={this.handleChange}>
                            <option>Choose Class...</option>
                            <option value="Airship">Airship</option>
                            <option value="Balloon Gas">Balloon(Gas)</option>
                            <option value="Balloon Heater">Balloon(Airborne Heater)</option>

                        </select>
                    </div>
                    <div className="form-group">
                        <label>Certificate Type</label>
                        <select name="certificateType"
                                className="form-control"
                                id="category-select"
                                value={this.state.certificateType}
                                onChange={this.handleChange}>
                            <option>Choose Certificate Type...</option>
                            <option value="student">Student</option>
                            <option value="sport">Sport</option>
                            <option value="private">Private</option>
                            <option value="commercial">Commercial</option>
                            <option value="airline_transport_pilot">ATP</option>
                        </select>
                    </div>

                </form>
                <br/>
            </div>
        )
    };

    addPoweredParachute = () =>{
        return (
            <div>
                <form id="certificate-form">
                    <div className="form-group">
                        <label>Class</label>
                        <select name="certificateClass"
                                className="form-control"
                                id="category-select"
                                value={this.state.certificateClass}
                                onChange={this.handleChange}>
                            <option>Choose Class...</option>
                            <option value="Land">Land</option>
                            <option value="Sea">Sea</option>

                        </select>
                    </div>
                    <div className="form-group">
                        <label>Certificate Type</label>
                        <select name="certificateType"
                                className="form-control"
                                id="category-select"
                                value={this.state.certificateType}
                                onChange={this.handleChange}>
                            <option>Choose Certificate Type...</option>
                            <option value="student">Student</option>
                            <option value="sport">Sport</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                </form>
                <br/>
            </div>
        )
    };

    addWeightShiftControl = () =>{
        return (
            <div>
                <form id="certificate-form">
                    <div className="form-group">
                        <label>Class</label>
                        <select name="certificateClass"
                                className="form-control"
                                id="category-select"
                                value={this.state.certificateClass}
                                onChange={this.handleChange}>
                            <option>Choose Class...</option>
                            <option value="Land">Land</option>
                            <option value="Sea">Sea</option>

                        </select>
                    </div>
                    <div className="form-group">
                        <label>Certificate Type</label>
                        <select name="certificateType"
                                className="form-control"
                                id="category-select"
                                value={this.state.certificateType}
                                onChange={this.handleChange}>
                            <option>Choose Certificate Type...</option>
                            <option value="student">Student</option>
                            <option value="sport">Sport</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                </form>
                <br/>
            </div>
        )
    };

    addGlider = () =>{
        return (
            <div>

                <form id="certificate-form">
                    <div className="form-group">
                        <label>Certificate Type</label>
                        <select name="certificateType"
                                className="form-control"
                                id="category-select"
                                value={this.state.certificateType}
                                onChange={this.handleChange}>
                            <option>Choose Certificate Type...</option>
                            <option value="sport">Sport</option>
                        </select>
                    </div>
                    <br/>

                    <div className="form-group">
                        <h4 id="certificates-header">Endorsements</h4>

                        <div  id="certificate-checkbox-container" className="col-md-6">
                        <input id="certificate-checkbox"
                               type="checkbox"
                               name="aero_tow"
                               onChange={this.handleChange}
                        />
                        <label>Aero Tow</label>
                        </div>

                        <div  id="certificate-checkbox-container" className="col-md-6">
                        <input id="certificate-checkbox"
                               type="checkbox"
                               name="winch_launch"
                               onChange={this.handleChange}
                        />
                        <label>Winch Launch</label>
                        </div>

                    </div>
                    <br/>

                </form>
                <br/>

            </div>
        )
    };

    handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({ [name]: value })
    };

    saveNewCertificate = () =>{
        axios.post(`${server}/pilot/pilotcertificate/${this.props.personId}`, {
            category: this.state.category,
            instrument_rating: this.state.instrument_rating,
            high_performance: this.state.high_performance,
            complex: this.state.complex,
            tailwheel: this.state.tailwheel,
            high_altitude: this.state.high_altitude,
            nvg: this.state.nvg,
            external_load: this.state.external_load,
            aero_tow: this.state.aero_tow,
            winch_launch: this.state.winch_launch,
            certificate_type: this.state.certificateType,
            class: this.state.certificateClass
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            })
    };

    render(){
        return(
            <div>
                <form id="certificate-form">
                <div className="form-group">

                    <label>Category</label>
                    <select name="category"
                            className="form-control"
                            id="category-select"
                            value={this.state.category}
                            onChange={this.handleChange}>
                        <option>Choose Category...</option>
                        <option value="Airplane">Airplane</option>
                        <option value="Rotocraft">Rotocraft</option>
                        <option value="Powered Lift">Powered Lift</option>
                        <option value="Lighter Than Air">Lighter Than Air</option>
                        <option value="Powered Parachute">Powered Parachute</option>
                        <option value="Weight-Shift Control">Weight-Shift Control</option>
                        <option value="Glider">Glider</option>


                    </select>

                </div>
                </form>

                {
                    this.state.category === "Airplane" &&
                    this.addAirplane()

                }
                {
                    this.state.category === "Rotocraft" &&
                        this.addRotocraft()
                }
                {
                    this.state.category === "Powered Lift" &&
                        this.addPoweredLift()
                }
                {
                    this.state.category === "Lighter Than Air" &&
                        this.addLighterThanAir()
                }
                {
                    this.state.category === "Powered Parachute" &&
                        this.addPoweredParachute()
                }
                {
                    this.state.category === "Weight-Shift Control" &&
                        this.addWeightShiftControl()
                }
                {
                    this.state.category === "Glider" &&
                        this.addGlider()
                }

                <div className="form-group">

                            <button id="pilot-certificate-new-btn"
                                    type="submit"
                                    className="btn btn-default"
                                    onClick={(e) => {this.saveNewCertificate(e); this.props.closeAddCertificates();}}
                            >
                                Submit
                            </button>

                </div>

            </div>
        )
    }

}

export default AddPilotCertificate;