var isEmpty = require('lodash/isEmpty');
var validator = require('validator');

function emailContactFormValidation(data) {
    let errors = {};

    if (validator.isEmpty(data.username)){
        errors.username = 'Username is required';
    }
    if (validator.isEmpty(data.password)){
        errors.password = 'Password is required';
    }
    if (validator.isEmpty(data.passwordConfirmation)){
        errors.passwordConfirmation = 'Confirmation is required';
    }
    if (!validator.equals(data.password, data.passwordConfirmation)) {
        errors.passwordConfirmation = 'Passwords must match';
    }
    if (validator.isEmpty(data.address)){
        errors.address = 'Address is required';
    }
    if (validator.isEmpty(data.city)){
        errors.city = 'City is required';
    }
    if (validator.isEmpty(data.state)){
        errors.state = 'State is required';
    }
    if (validator.isEmpty(data.country)){
        errors.country = 'Country is required';
    }
    if (validator.isEmpty(data.zip)){
        errors.zip = 'Zip is required'
    }
    if (validator.isEmpty(data.dob)){
        errors.dob = 'Date of Birth is required'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = emailContactFormValidation;

