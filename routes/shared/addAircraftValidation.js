var isEmpty = require('lodash/isEmpty');
var validator = require('validator');

function addAircraftValidation(data) {
    let errors = {};

    if (validator.isEmpty(data.make)){
        errors.make = 'Aircraft make is required'
    }
    if (validator.isEmpty(data.registration_nbr)){
        errors.registration_nbr = 'Aircraft registration number is required'
    }
    if (validator.isEmpty(data.year)){
        errors.year = 'Aircraft model year is required'
    }
    if (validator.isEmpty(data.hobbs)){
        errors.hobbs = 'Aircraft hobbs is required'
    }
    if (validator.isEmpty(data.tach)){
        errors.tach = 'Aircraft tach is required'
    }
    if (validator.isEmpty(data.hundred_hr_inspection)){
        errors.hundred_hr_inspection = 'Hundred Hour Inspection is required'
    }
    if (validator.isEmpty(data.pitot_static_inspection)){
        errors.pitot_static_inspection = 'Pitot Static Inspection date is required'
    }
    if (validator.isEmpty(data.vor_check)){
        errors.vor_check = 'VOR Check Date is required'
    }
    if (validator.isEmpty(data.transponder_certification)){
        errors.transponder_certification = 'Transponder Certification date is required'
    }
    if (validator.isEmpty(data.elt_certification)){
        errors.elt_certification = 'ELT Certification date is required'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = addAircraftValidation;