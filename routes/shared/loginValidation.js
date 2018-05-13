var isEmpty = require('lodash/isEmpty');
var validator = require('validator');

function loginValidation(data) {
    let errors = {};

    if (validator.isEmpty(data.identifier)) {
        errors.identifier = "Username or Email Required"
    }
    if (validator.isEmpty(data.password)) {
        errors.password = "Password is Required"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = loginValidation;