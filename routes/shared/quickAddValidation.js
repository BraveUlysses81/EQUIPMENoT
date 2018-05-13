var isEmpty = require('lodash/isEmpty');
var validator = require('validator');

function quickAddValidation(data) {
    let errors = {};

    if (validator.isEmpty(data.first_name)){
        errors.first_name = 'First Name is required';
    }
    if (validator.isEmpty(data.last_name)){
        errors.last_name = 'Last Name is required';
    }
    if (validator.isEmpty(data.mobile)){
        errors.mobile = 'Mobile Phone is required';
    }
    if (validator.isEmpty(data.membership_type)){
        errors.membership_type = 'Membership type is required';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = quickAddValidation;
