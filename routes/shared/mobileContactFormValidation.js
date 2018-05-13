var isEmpty = require('lodash/isEmpty');
var validator = require('validator');

function mobileContactFormValidation(data) {
    let errors = {};

    if (validator.isEmpty(data.email)){
        errors.email = 'Email is required';
    }
    if (!data.agreement_signed){
        errors.agreement_signed = 'You must agree to the terms';
    }
    if (!validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }
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

module.exports = mobileContactFormValidation;

