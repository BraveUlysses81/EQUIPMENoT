import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import TextFieldGroup from '../TextFieldGroup'
import classnames from 'classnames'


class AircraftDetailContact extends React.Component  {

    constructor(){
        super()
    }

    static propTypes = {
        canEditAircraftDetail: PropTypes.bool.isRequired,
        selectedAircraft: PropTypes.object.isRequired,
        handleDetailsSubmit: PropTypes.func.isRequired,
        handleDetailsChange: PropTypes.func.isRequired
    };

    render() {
        const { hobbs, tach, hundred_hr_inspection, pitot_static_inspection, dual_only, ifr_certificate, airbags,
            night_certificate, transponder_certification, elt_certification, gps_database_update,
            parachute, glass_cockpit, auto_pilot, gps, vor_check } = this.props.selectedAircraft;
        const canEditAircraftDetail = this.props.canEditAircraftDetail;

        return (
            <div id="aircraft-detail-contact">

                    <div className="col-md-4">
                        <div>
                            <div id="aircraft-detail-info-top-box">
                            <TextFieldGroup
                                inputId="aircraft-detail-info-inputs"
                                labelId="aircraft-detail-info-label"
                                label="Hobbs"
                                field="hobbs"
                                value={hobbs}
                                readOnly={!canEditAircraftDetail}
                                onChange={this.props.handleDetailsChange}
                                error={this.props.errors.hobbs}
                            />
                            </div>
                            <div id="aircraft-detail-info-box">
                            <TextFieldGroup
                                inputId="aircraft-detail-info-inputs"
                                labelId="aircraft-detail-info-label"
                                label="Tach"
                                field="tach"
                                value={tach}
                                readOnly={!canEditAircraftDetail}
                                onChange={this.props.handleDetailsChange}
                                error={this.props.errors.tach}
                            />
                            </div>
                            <div id="aircraft-detail-info-box">
                            <TextFieldGroup
                                inputId="aircraft-detail-info-inputs"
                                labelId="aircraft-detail-info-label"
                                label="Hundred Hour Inspection"
                                field="hundred_hr_inspection"
                                value={hundred_hr_inspection}
                                readOnly={!canEditAircraftDetail}
                                onChange={this.props.handleDetailsChange}
                                error={this.props.errors.hundred_hr_inspection}
                            />
                            </div>
                            <div id="aircraft-detail-info-box">
                            <TextFieldGroup
                                inputId="aircraft-detail-info-inputs"
                                labelId="aircraft-detail-info-label"
                                label="Pitot Static Inspection (24 months)"
                                field="pitot_static_inspection"
                                type="date"
                                value={pitot_static_inspection}
                                readOnly={!canEditAircraftDetail}
                                onChange={this.props.handleDetailsChange}
                                error={this.props.errors.pitot_static_inspecti}
                            />
                            </div>
                        </div>

                        <div>
                            {
                                canEditAircraftDetail ?
                                    (<form onSubmit={this.props.handleDetailsSubmit}>
                                        <button id="pin-flight-btn" type="submit" className="btn btn-primary" disabled={!canEditAircraftDetail}>
                                            Save Changes
                                        </button>
                                    </form>) :
                                    <div />
                            }
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div>
                            <div>
                            <TextFieldGroup
                                inputId="aircraft-detail-info-inputs"
                                labelId="aircraft-detail-info-label"
                                label="VOR Check (30 days)"
                                field="vor_check"
                                type="date"
                                value={vor_check}
                                readOnly={!canEditAircraftDetail}
                                onChange={this.props.handleDetailsChange}
                                error={this.props.errors.vor_check}
                            />
                            </div>
                            <div id="aircraft-detail-info-box">
                            <TextFieldGroup
                                inputId="aircraft-detail-info-inputs"
                                labelId="aircraft-detail-info-label"
                                label="Transponder Certification (24 months)"
                                field="transponder_certification"
                                type="date"
                                value={transponder_certification}
                                readOnly={!canEditAircraftDetail}
                                onChange={this.props.handleDetailsChange}
                                error={this.props.errors.transponder_certification}
                            />
                            </div>
                            <div id="aircraft-detail-info-box">
                            <TextFieldGroup
                                inputId="aircraft-detail-info-inputs"
                                labelId="aircraft-detail-info-label"
                                label="ELT Certification (12 months)"
                                field="elt_certification"
                                type="date"
                                value={elt_certification}
                                readOnly={!canEditAircraftDetail}
                                onChange={this.props.handleDetailsChange}
                                error={this.props.errors.elt_certification}
                            />
                            </div>
                            <div id="aircraft-detail-info-box">
                            <TextFieldGroup
                                inputId="aircraft-detail-info-inputs"
                                labelId="aircraft-detail-info-label"
                                label="GPS Database Update (28 days)"
                                field="gps_database_update"
                                type="date"
                                value={gps_database_update}
                                readOnly={!canEditAircraftDetail}
                                onChange={this.props.handleDetailsChange}
                                error={this.props.errors.gps_database_update}
                            />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div>
                            <div id="aircraft-detail-info-top-checkbox" className={classnames("form-group")} >
                                <input
                                    id="aircraft-detail-info-checkbox-inputs"
                                    type="checkbox"
                                    name="dual_only"
                                    checked={!!dual_only}
                                    disabled={!canEditAircraftDetail}
                                    onChange={this.props.handleDetailsChange}
                                />
                                <label id="aircraft-detail-info-checkbox-label" className="control-label">Dual Only</label>
                            </div>
                            <div id="aircraft-detail-info-checkbox" className={classnames("form-group")} >
                                <input
                                    id="aircraft-detail-info-checkbox-inputs"
                                    type="checkbox"
                                    name="ifr_certificate"
                                    checked={!!ifr_certificate}
                                    disabled={!canEditAircraftDetail}
                                    onChange={this.props.handleDetailsChange}
                                />
                                <label id="aircraft-detail-info-checkbox-label" className="control-label">IFR Certificate</label>
                            </div>
                            <div id="aircraft-detail-info-checkbox" className={classnames("form-group")} >
                                <input
                                    id="aircraft-detail-info-checkbox-inputs"
                                    type="checkbox"
                                    name="night_certificate"
                                    checked={!!night_certificate}
                                    disabled={!canEditAircraftDetail}
                                    onChange={this.props.handleDetailsChange}
                                />
                                <label id="aircraft-detail-info-checkbox-label" className="control-label">Night Certificate</label>
                            </div>
                            <div id="aircraft-detail-info-checkbox" className={classnames("form-group")} >
                                <input
                                    id="aircraft-detail-info-checkbox-inputs"
                                    type="checkbox"
                                    name="glass_cockpit"
                                    checked={!!glass_cockpit}
                                    disabled={!canEditAircraftDetail}
                                    onChange={this.props.handleDetailsChange}
                                />
                                <label id="aircraft-detail-info-checkbox-label" className="control-label">Glass Cockpit</label>
                            </div>
                            <div id="aircraft-detail-info-checkbox" className={classnames("form-group")} >
                                <input
                                    id="aircraft-detail-info-checkbox-inputs"
                                    type="checkbox"
                                    name="auto_pilot"
                                    checked={!!auto_pilot}
                                    disabled={!canEditAircraftDetail}
                                    onChange={this.props.handleDetailsChange}
                                />
                                <label id="aircraft-detail-info-checkbox-label" className="control-label">Auto Pilot</label>
                            </div>
                            <div id="aircraft-detail-info-checkbox" className={classnames("form-group")} >
                                <input
                                    id="aircraft-detail-info-checkbox-inputs"
                                    type="checkbox"
                                    name="airbags"
                                    checked={!!airbags}
                                    disabled={!canEditAircraftDetail}
                                    onChange={this.props.handleDetailsChange}
                                />
                                <label id="aircraft-detail-info-checkbox-label" className="control-label">Airbags</label>
                            </div>
                            <div id="aircraft-detail-info-checkbox" className={classnames("form-group")} >
                                <input
                                    id="aircraft-detail-info-checkbox-inputs"
                                    type="checkbox"
                                    name="parachute"
                                    checked={!!parachute}
                                    disabled={!canEditAircraftDetail}
                                    onChange={this.props.handleDetailsChange}
                                />
                                <label id="aircraft-detail-info-checkbox-label" className="control-label">Parachute</label>
                            </div>
                            <div id="aircraft-detail-info-checkbox" className={classnames("form-group")} >
                                <input
                                    id="aircraft-detail-info-checkbox-inputs"
                                    type="checkbox"
                                    name="gps"
                                    checked={!!gps}
                                    disabled={!canEditAircraftDetail}
                                    onChange={this.props.handleDetailsChange}
                                />
                                <label id="aircraft-detail-info-checkbox-label" className="control-label">GPS</label>
                            </div>
                        </div>
                    </div>

            </div>
        )
    }
}

export default AircraftDetailContact;