import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const AircraftSelectInput = ({ field, value, label, error, onChange, displayArray, defaultOption }) => {
    return (
        <div className={ classnames("form-group", {'has-error': error})} >
            <label id="aircraft-add-make" className="control-label">{label}</label>
            <select
                name={field}
                value={value}
                onChange={onChange}
                className="form-control"
            >
                <option value='' disabled>
                    {defaultOption}
                </option>

                {displayArray}

            </select>
            { error ? (<span id="textfieldgroup-error" className="help-block">{error}</span>) : (<span id="textfieldgroup-error-none">{error}</span>)}
        </div>
    )
};


AircraftSelectInput.propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string,
    error: PropTypes.string
};

export default AircraftSelectInput;