var isEmpty = require('lodash/isEmpty');
var validator = require('validator');

function signupValidation(data) {
    let errors = {};

    if (validator.isEmpty(data.first_name)){
        errors.first_name = 'First name is required';
    }
    if (validator.isEmpty(data.last_name)){
        errors.last_name = 'Last name is required';
    }
    if (validator.isEmpty(data.username)){
        errors.username = 'Username is required';
    }
    if (validator.isEmpty(data.email)){
        errors.email = 'Email is required';
    }
    if (!validator.isEmail(data.email)){
        errors.email = 'Email is invalid'
    }
    if(!validator.isMobilePhone(data.mobile, 'en-US')){
        errors.mobile = 'Mobile Phone invalid format'
    }
    if (validator.isEmpty(data.password)){
        errors.password = 'Field is required';
    }
    if (validator.isEmpty(data.passwordConfirmation)){
        errors.passwordConfirmation = 'Field is required';
    }
    if (!validator.equals(data.password, data.passwordConfirmation)) {
        errors.passwordConfirmation = 'Passwords must match';
    }
    if(validator.isEmpty(data.selectedSchool)){
        errors.selectedSchool = "A School is required"
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = signupValidation;

