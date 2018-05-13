import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap'
import { getAircraftModels, getAircraftMakes, getAircraftEngines, addAircraft } from '../../actions/aircraftActions';
import TextFieldGroup from '../TextFieldGroup';
import AircraftSelectInput from './AircraftSelectInput'

const validateInput = require('../../../routes/shared/addAircraftValidation');

class AddAircraft extends React.Component {

    state = {
        registration_nbr: '',
        aircraftModels: [],
        model_id: null,
        make: '',
        aircraftMakes: [],
        school_id: '',
        year: '',
        engine: null,
        aircraftEngines: [],
        hobbs: '',
        tach: '',
        hundred_hr_inspection: '',
        pitot_static_inspection: '',
        vor_check: '',
        transponder_certification: '',
        elt_certification: '',
        gps_database_update: '',
        dual_only: false,
        ifr_certificate: false,
        night_certificate: false,
        glass_cockpit: false,
        auto_pilot: false,
        airbags: false,
        parachute: false,
        gps: false,
        nullEngine: false,
        nullModelEngine: false,
        errors: '',
        isFetching: ''
    };

    constructor(props) {
        super(props)
    }

    static propTypes = {
        school_id: PropTypes.number.isRequired,
        getAircraftModels: PropTypes.func.isRequired,
        getAircraftMakes: PropTypes.func.isRequired,
        getAircraftEngines: PropTypes.func.isRequired
    };

    componentWillMount() {
        //set history for modal fall back
        this.context.router.history.push(`/add/aircraft`);

        this.props.getAircraftMakes()
            .then((data) => {
            Object.keys(data.data).map(key => {
                const aircraftMakes = {...this.state.aircraftMakes};
                aircraftMakes[key] = data.data[key].make;
                this.setState({ aircraftMakes });
                })
            })
    }

    onChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        if (target.name === 'make') {
            this.setState({aircraftModels: []});
            this.props.getAircraftModels(e.target.value)
                .then((models) => {
                    if(models.data) {
                        Object.keys(models.data).map((key) => {
                            if (models.data[key]) {
                                const aircraftModels = {...this.state.aircraftModels};
                                //index customer and add to the customers array
                                aircraftModels[key] = models.data[key];
                                //set state
                                this.setState({ aircraftModels });
                            }
                        })
                    } else {
                        this.setState({ nullModelEngine: true })
                    }
                })
        } else if (target.name === 'model_id') {
            this.setState({aircraftEngines: [], engine: []});
            this.props.getAircraftEngines(e.target.value)
                .then((engines) => {
                    if (engines.data) {
                        Object.keys(engines.data).map((key) => {
                            if (engines.data[key]) {
                                const aircraftEngines = {...this.state.aircraftEngines};
                                //index customer and add to the customers array
                                aircraftEngines[key] = engines.data[key];
                                //set state
                                this.setState({aircraftEngines});
                            }
                        })
                    } else {
                        this.setState({ nullEngine: true })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        this.setState({[target.name]: value})
    };

    isvalid = () => {
        const { errors, isValid } = validateInput(this.state);

        if(!isValid) {
            this.setState({ errors })
        }

        return isValid
    };

    onSubmit = (e) => {
        e.preventDefault();

        this.setState({ errors: {}, isFetching: true });
        if(this.isvalid()){
            this.props.addAircraft(this.props.school_id, this.state)
                .then( () => {
                    this.context.router.history.push('/aircraft');

                })
                .catch( (err) => {
                    console.log(err)
                })
        }
    };

    render() {
        const { errors, registration_nbr, aircraftModels, model_id, aircraftMakes, make, year, engine, aircraftEngines, hobbs, tach,
            hundred_hr_inspection, pitot_static_inspection, vor_check, transponder_certification, elt_certification, gps_database_update,
            dual_only, ifr_certificate, night_certificate, glass_cockpit, auto_pilot, airbags, parachute, gps, isFetching } = this.state

        const makesArray = Object.keys(aircraftMakes)
            .map(key => <option key={key} > {aircraftMakes[key]}</option>);

        const modelsArray = Object.keys(aircraftModels)
            .map(key => <option key={key} >{aircraftModels[key].model_id}</option>);

        const engineArray = Object.keys(aircraftEngines)
            .map(key => <option key={key} >{aircraftEngines[key].engine}</option>);

        return (
            <div>
                <Navbar id="add-aircraft-desk-nav" >
                    <Nav id="customer-desk-nav-item" >
                        <NavDropdown eventKey="1" title="Aircraft Tasks" id="customer-desk-nav-button">
                            <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/aircraft`, state: {modal: false}}} >
                                <MenuItem eventKey="1.1">
                                    <div id="quick-add-customer-button">
                                        Aircraft Home
                                    </div>
                                </MenuItem>
                            </LinkContainer>
                            <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/`, state: {modal: true}}} >
                                <MenuItem eventKey="1.2">
                                    <div id="quick-add-customer-button">
                                        Dispatch Aircraft
                                    </div>
                                </MenuItem>
                            </LinkContainer>
                            <LinkContainer id="customer-desk-nav-dropdown" to={{pathname: `/modal/aircraft/ground`, state: {modal: true}}} >
                                <MenuItem eventKey="1.3">
                                    <div id="quick-add-customer-button">
                                        Ground / Unground Aircraft
                                    </div>
                                </MenuItem>
                            </LinkContainer>
                        </NavDropdown>
                    </Nav>
                </Navbar>
                <div id="add-aircraft-container">
                    <form id="add-aircraft-form" onSubmit={this.onSubmit} >
                        <div className="row">

                            <h2>Add Aircraft Form</h2>
                            <hr id="customer-detail-header-hr" />

                            <div className={ classnames("form-group", {'has-error': errors.form})}>
                                { errors.form ? (
                                        <span id="textfieldgroup-error" className="help-block">{errors.form }</span>) : (
                                        <span id="textfieldgroup-error-none"></span>)}
                            </div>

                            <div className="col-md-4">
                                <div id="add-aircraft-input-container">
                                <TextFieldGroup
                                    field="registration_nbr"
                                    value={registration_nbr}
                                    label="Registration Nbr"
                                    onChange={this.onChange}
                                    error={errors.registration_nbr}
                                />
                                </div>
                                <div id="add-aircraft-input-container">
                                <AircraftSelectInput
                                    label="Aircraft Make"
                                    field="make"
                                    onChange={this.onChange}
                                    value={make}
                                    error={errors.make}
                                    displayArray={makesArray}
                                    defaultOption="Choose the Aircraft Make"
                                />
                                </div>
                                <div id="add-aircraft-input-container">
                                <AircraftSelectInput
                                    label="Aircraft Model"
                                    field="model_id"
                                    onChange={this.onChange}
                                    value={model_id}
                                    error={errors.model_id}
                                    displayArray={modelsArray}
                                    defaultOption="Choose the Aircraft Model"
                                />
                                </div>
                                <div id="add-aircraft-input-container">
                                <AircraftSelectInput
                                    label="Engine"
                                    field="engine"
                                    onChange={this.onChange}
                                    value={engine}
                                    error={errors.engine}
                                    displayArray={engineArray}
                                    defaultOption="Choose the Aircraft Engine"
                                />
                                </div>
                                <div id="add-aircraft-input-container">
                                <TextFieldGroup
                                    field="year"
                                    value={year}
                                    label="Model Year"
                                    onChange={this.onChange}
                                    error={errors.year}
                                />
                                </div>
                                <div id="add-aircraft-input-container">
                                <TextFieldGroup
                                    field="hobbs"
                                    value={hobbs}
                                    label="Aircraft Hobbs"
                                    onChange={this.onChange}
                                    error={errors.hobbs}
                                />
                                </div>
                                <div id="add-aircraft-input-container">
                                <TextFieldGroup
                                    field="tach"
                                    value={tach}
                                    label="Aircraft Tach"
                                    onChange={this.onChange}
                                    error={errors.tach}
                                />
                                </div>
                            </div>


                            <div className="col-md-4">
                                <div id="add-aircraft-input-container">
                                <TextFieldGroup
                                    field="hundred_hr_inspection"
                                    value={hundred_hr_inspection}
                                    label="Hundred Hour Inspection hours"
                                    onChange={this.onChange}
                                    error={errors.hundred_hr_inspection}
                                />
                                </div>
                                <div id="add-aircraft-input-container">
                                <TextFieldGroup
                                    field="pitot_static_inspection"
                                    type="date"
                                    value={pitot_static_inspection}
                                    label="Pitot Static Inspection (24 months)"
                                    onChange={this.onChange}
                                    error={errors.pitot_static_inspection}
                                />
                                </div>
                                <div id="add-aircraft-input-container">
                                <TextFieldGroup
                                    field="vor_check"
                                    type="date"
                                    value={vor_check}
                                    label="VOR Check (30 days)"
                                    onChange={this.onChange}
                                    error={errors.vor_check}
                                />
                                </div>
                                <div id="add-aircraft-input-container">
                                <TextFieldGroup
                                    field="transponder_certification"
                                    type="date"
                                    value={transponder_certification}
                                    label="Transponder Certification (24 months)"
                                    onChange={this.onChange}
                                    error={errors.transponder_certification}
                                />
                                </div>
                                <div id="add-aircraft-input-container">
                                <TextFieldGroup
                                    field="elt_certification"
                                    type="date"
                                    value={elt_certification}
                                    label="ELT Certification (12 months)"
                                    onChange={this.onChange}
                                    error={errors.elt_certification}
                                />
                                </div>
                                <div id="add-aircraft-input-container">
                                <TextFieldGroup
                                    field="gps_database_update"
                                    type="date"
                                    value={gps_database_update}
                                    label="GPS Database Update (28 days)"
                                    onChange={this.onChange}
                                    error={errors.gps_database_update}
                                />
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div id="aircraft-detail-info-top-checkbox" className={classnames("form-group")} >
                                    <input
                                        id="aircraft-detail-info-checkbox-inputs"
                                        type="checkbox"
                                        name="dual_only"
                                        checked={dual_only}
                                        onChange={this.onChange}
                                    />
                                    <label id="add-aircraft-checkbox-label" className="control-label">Dual Only</label>
                                </div>
                                <div id="aircraft-detail-info-checkbox" className={classnames("form-group")} >
                                    <input
                                        id="aircraft-detail-info-checkbox-inputs"
                                        type="checkbox"
                                        name="ifr_certificate"
                                        checked={ifr_certificate}
                                        onChange={this.onChange}
                                    />
                                    <label id="add-aircraft-checkbox-label" className="control-label">IFR Certificate</label>
                                </div>
                                <div id="aircraft-detail-info-checkbox" className={classnames("form-group")} >
                                    <input
                                        id="aircraft-detail-info-checkbox-inputs"
                                        type="checkbox"
                                        name="night_certificate"
                                        checked={night_certificate}
                                        onChange={this.onChange}
                                    />
                                    <label id="add-aircraft-checkbox-label" className="control-label">Night Certificate</label>
                                </div>
                                <div id="aircraft-detail-info-checkbox" className={classnames("form-group")} >
                                    <input
                                        id="aircraft-detail-info-checkbox-inputs"
                                        type="checkbox"
                                        name="glass_cockpit"
                                        checked={glass_cockpit}
                                        onChange={this.onChange}
                                    />
                                    <label id="add-aircraft-checkbox-label" className="control-label">Glass Cockpit</label>
                                </div>
                                <div id="aircraft-detail-info-checkbox" className={classnames("form-group")} >
                                    <input
                                        id="aircraft-detail-info-checkbox-inputs"
                                        type="checkbox"
                                        name="auto_pilot"
                                        checked={auto_pilot}
                                        onChange={this.onChange}
                                    />
                                    <label id="add-aircraft-checkbox-label" className="control-label">Auto Pilot</label>
                                </div>
                                <div id="aircraft-detail-info-checkbox" className={classnames("form-group")} >
                                    <input
                                        id="aircraft-detail-info-checkbox-inputs"
                                        type="checkbox"
                                        name="airbags"
                                        checked={airbags}
                                        onChange={this.onChange}
                                    />
                                    <label id="add-aircraft-checkbox-label" className="control-label">Airbags</label>
                                </div>
                                <div id="aircraft-detail-info-checkbox" className={classnames("form-group")} >
                                    <input
                                        id="aircraft-detail-info-checkbox-inputs"
                                        type="checkbox"
                                        name="parachute"
                                        checked={parachute}
                                        onChange={this.onChange}
                                    />
                                    <label id="add-aircraft-checkbox-label" className="control-label">Parachute</label>
                                </div>
                                <div id="aircraft-detail-info-checkbox" className={classnames("form-group")} >
                                    <input
                                        id="aircraft-detail-info-checkbox-inputs"
                                        type="checkbox"
                                        name="gps"
                                        checked={gps}
                                        onChange={this.onChange}
                                    />
                                    <label id="add-aircraft-checkbox-label" className="control-label">GPS</label>
                                </div>
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <button type="submit" className="btn btn-primary" disabled={isFetching} >
                                    Save Changes
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

AddAircraft.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    school_id: state.member.school_id
});

export default connect(mapStateToProps, { getAircraftModels, getAircraftMakes, getAircraftEngines, addAircraft })(AddAircraft);