var isEmpty = require('lodash/isEmpty');
var validator = require('validator');

function addressValidation(data) {
    let errors = {};

    if (validator.isEmpty(data.address)){
        errors.address = 'Address is required';
    }
    if (validator.isEmpty(data.city)){
        errors.city = 'A city is required';
    }
    if (validator.isEmpty(data.state)){
        errors.state = 'A state is required';
    }
    if (validator.isEmpty(data.country)){
        errors.country = 'A country is required';
    }
    if (validator.isEmpty(data.zip)){
        errors.zip = 'A zip is required'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = addressValidation;
