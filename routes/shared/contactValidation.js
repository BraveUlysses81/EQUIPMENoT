var isEmpty = require('lodash/isEmpty');
var validator = require('validator');

function contactValidation(data) {
    let errors = {};

    if (validator.isEmpty(data.first_name)){
        errors.first_name = 'First Name is required';
    }
    if (validator.isEmpty(data.last_name)){
        errors.last_name = 'Last Name is required';
    }
    if (validator.isEmpty(data.email)){
        errors.email = 'Email is required';
    }
    if (validator.isEmpty(data.username)){
        errors.username = 'A username required'
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = contactValidation;