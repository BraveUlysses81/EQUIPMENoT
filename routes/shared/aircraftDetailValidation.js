var isEmpty = require('lodash/isEmpty');
var validator = require('validator');

function aircraftDetailValidation(data) {
    let errors = {};

    if (validator.isEmpty(data.hobbs)){
        errors.hobbs = 'Aircraft Hobbs is required'
    }
    if (validator.isEmpty(data.tach)){
        errors.tach = 'Aircraft tach is required'
    }
    if (validator.isEmpty(data.hundred_hr_inspection)){
        errors.hundred_hr_inspection = 'Hundred Hour Inspection is required'
    }
    if (validator.isEmpty(data.pitot_static_inspection)){
        errors.pitot_static_inspection = 'Pitot Static Inspection Date is required'
    }
    if (validator.isEmpty(data.vor_check)){
        errors.vor_check = 'VOR Check Date is required'
    }
    if (validator.isEmpty(data.transponder_certification)){
        errors.transponder_certification = 'Transponder Certification Date is required'
    }
    if (validator.isEmpty(data.elt_certification)){
        errors.elt_certification = 'ELT Certification Date is required'
    }
    if (validator.isEmpty(data.gps_database_update)){
        errors.gps_database_update = 'GPS Database Update Date is required'
    }
    // if (validator.isBoolean(data.dual_only)){
    //     errors.dual_only = 'Dual only is required to be true or false'
    // }
    // if (validator.isBoolean(data.ifr_certificate)){
    //     errors.ifr_certificate = 'IFR Certificate is required to be true or false'
    // }
    // if (validator.isBoolean(data.night_certificate)){
    //     errors.night_certificate = 'Night Certificate is required to be true or false'
    // }
    // if (validator.isBoolean(data.glass_cockpit)){
    //     errors.glass_cockpit = 'Glass Cockpit is required to be true or false'
    // }
    // if (validator.isBoolean(data.auto_pilot)){
    //     errors.auto_pilot = 'Auto pilot is required to be true or false'
    // }
    // if (validator.isBoolean(data.airbags)){
    //     errors.airbags = 'Airbags is required to be true or false'
    // }
    // if (validator.isBoolean(data.parachute)){
    //     errors.parachute = 'Parachute is required to be true or false'
    // }
    // if (validator.isBoolean(data.gps)){
    //     errors.gps = 'GPS is required to be true or false'
    // }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = aircraftDetailValidation;