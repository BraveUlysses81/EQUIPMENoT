
import C from '../helpers/actionTypes'
var isEmpty = require('lodash/isEmpty');


export const authReducer = (state = { isFetching: false, isAuthenticated: false, redirectToReferrer: false, user: {}, member: {} }, action) => {
    switch (action.type) {
        case C.LOGIN_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                isAuthenticated: false,
                redirectToReferrer: false,
                user: action.user,
                member: {}
            })
        case C.LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: true,
                redirectToReferrer: false,
                user: action.user,
                member: {}
            })
        case C.LOGIN_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: false,
                errorMessage: action.message
            })
        case C.LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: false,
                redirectToReferrer: false,
                user: {},
                member: {}
            })
        case C.MEMBER_SELECT:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: !isEmpty(action.user),
                redirectToReferrer: true,
                user: action.user,
                member: action.member
            })
        default:
            return state
    }
}





