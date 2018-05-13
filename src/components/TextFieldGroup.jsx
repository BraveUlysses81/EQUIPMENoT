import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const TextFieldGroup = ({ field, value, label, error, type, onChange, labelId, inputId, readOnly }) => {
    return (
        <div className={ classnames("form-group", {'has-error': error})} >
            <label id={labelId} className="control-label">{label}</label>
            <input
                id={inputId}
                name={field}
                value={value}
                onChange={onChange}
                type={type}
                className="form-control"
                readOnly={readOnly}
            />
            { error ? (<span id="textfieldgroup-error" className="help-block">{error}</span>) : (<span id="textfieldgroup-error-none">{error}</span>)}
        </div>
    );
}

TextFieldGroup.propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string,
    error: PropTypes.string,
    type: PropTypes.string.isRequired,
    labelId: PropTypes.string,
    inputId: PropTypes.string
}

TextFieldGroup.defaultProps = {
    type: 'text',
    value: '',
    label: '',
    labelId: '',
    inputId: '',
    error: '',
    readOnly: false
}

export default TextFieldGroup;