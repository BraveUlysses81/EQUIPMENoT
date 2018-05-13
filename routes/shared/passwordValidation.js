var isEmpty = require('lodash/isEmpty');
var validator = require('validator');

function loginValidation(data) {
    let errors = {};

    if (validator.isEmpty(data.password)){
        errors.password = 'Field is required';
    }
    if (validator.isEmpty(data.passwordConfirmation)){
        errors.passwordConfirmation = 'Field is required';
    }
    if (!validator.equals(data.password, data.passwordConfirmation)) {
        errors.passwordConfirmation = 'Passwords must match';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = loginValidation;