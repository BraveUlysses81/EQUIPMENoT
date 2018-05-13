var isEmpty = require('lodash/isEmpty');
//validation function to check for duplicate users on signup attempt
function validateDuplicateInput(data, db, otherValidations) {

    let { errors } = otherValidations(data);

    return Promise.all([
        // //query db for duplicate email
        // db.one("SELECT * " +
        //     "FROM login l " +
        //     "WHERE l.email = $1 ", data.email)
        //     .then(user => {
        //         if(user){ errors.email = 'Email already in use by another user'; }
        //
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     }),
        // //query db for duplicate user
        db.one("SELECT * " +
            "FROM login l " +
            "WHERE l.username = $1 ", data.username)
            .then(user => {
                if(user){ errors.username = 'Username is not available'; }
            })
            .catch((err) => {
                console.log(err);
            }),
    ]).then(() => {
        console.log(errors)
        return {
            errors,
            isValid: isEmpty(errors)
        }
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = validateDuplicateInput;