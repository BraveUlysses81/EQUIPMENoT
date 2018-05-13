var isEmpty = require('lodash/isEmpty');
var validator = require('validator');

function emergencyContactValidation(data) {
    let errors = {};

    if (validator.isEmpty(data.emergency_first_name)){
        errors.emergency_first_name = 'First Name is required';
    }
    if (validator.isEmpty(data.emergency_last_name)){
        errors.emergency_last_name = 'Last Name is required';
    }
    if (validator.isEmpty(data.emergency_phone)){
        errors.emergency_phone = 'Phone is required';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = emergencyContactValidation;
