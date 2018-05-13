var isEmpty = require('lodash/isEmpty');
var validator = require('validator');

function customerDetailValidation(data) {
    let errors = {};

    if (validator.isEmpty(data.mobile)){
        errors.mobile = 'Mobile phone is required'
    }
    if (validator.isEmpty(data.address)){
        errors.address = 'Address is required'
    }
    if (validator.isEmpty(data.city)){
        errors.city = 'City is required'
    }
    if (validator.isEmpty(data.state)){
        errors.state = 'State is required'
    }
    if (validator.isEmpty(data.zip)){
        errors.zip = 'Zip is required'
    }
    if (validator.isEmpty(data.emergency_first_name)){
        errors.emergency_first_name = 'Emergency first name is required'
    }
    if (validator.isEmpty(data.emergency_last_name)){
        errors.emergency_last_name = 'Emergency last name is required'
    }
    if (validator.isEmpty(data.emergency_phone)){
        errors.emergency_phone = 'Emergency phone is required'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = customerDetailValidation;