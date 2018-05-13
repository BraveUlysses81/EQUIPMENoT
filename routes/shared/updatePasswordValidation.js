var isEmpty = require('lodash/isEmpty');
var validator = require('validator');

function updatePasswordValidation(data) {
    let errors = {};

    if (validator.isEmpty(data.currentPassword)){
        errors.currentPassword = 'Field is required';
    }
    if (validator.isEmpty(data.passwordConfirmation)){
        errors.passwordConfirmation = 'Field is required';
    }
    if (validator.isEmpty(data.newPassword)){
        errors.newPassword = 'Field is required';
    }
    if (!validator.equals(data.newPassword, data.passwordConfirmation)) {
        errors.passwordConfirmation = 'Passwords must match';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = updatePasswordValidation;