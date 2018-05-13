var isEmpty = require('lodash/isEmpty');
var validator = require('validator');

function inviteAcceptValidation(data) {
    let errors = {};

    if (validator.isEmpty(data.tsa_endorsement)){
        errors.tsa_endorsement = 'TSA endorsement is required';
    }
    if (validator.isEmpty(data.regulation_type)){
        errors.regulation_type = 'Regulation type is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = inviteAcceptValidation;