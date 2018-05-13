import C from '../helpers/actionTypes'
import setAuthorizationToken from '../helpers/setAuthorizationToken'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { server } from '../helpers/serverAddress'




export const receiveLogin = (user) => ({
    type: C.LOGIN_SUCCESS,
    user
});

export const memberSelection = (member, user) => ({
    type: C.MEMBER_SELECT,
    user,
    member
});

const receiveLogout = () => ({
    type: C.LOGOUT_SUCCESS
});

export const loginUser = (userData) => {
    return dispatch => {
        return axios.post(`${server}/login`, {
            identifier: userData.identifier,
            password: userData.password
        },{ headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }} ).then(res => {
            const token = res.data;
            localStorage.setItem('jwtToken', token);
            dispatch(receiveLogin(jwt.decode(token)));
        })
    }
};

export const loginMember = (membership_id, user) => {
    return dispatch => {
        return axios.post(`${server}/login/member/${membership_id}`, {
            user
        }, {headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` } })
            .then(res => {
                const member = res.data;
                localStorage.setItem('member', member);
                dispatch(memberSelection(jwt.decode(member), user));
            })
    }
}

export const mobileContactFormAddRequest = (userData) => {
    return () => {
        return axios.post(`${server}/signup/information/mobile/${userData.invite_id}`, userData)
    }
}

export const mobileContactFormAddRequestExtra = (userData) => {
    return () => {
        return axios.post(`${server}/signup/information/mobile/extra/${userData.invite_id}`, userData)
    }
}

export const emailContactFormAddRequest = (userData) => {
    return () => {
        return axios.post(`${server}/signup/information/email/${userData.invite_id}`, userData)
    }
}

export const verifyInviteStatus = (invite_id) => {
    return () => {
        return axios.get(`${server}/membership/invite/status/${invite_id}`)
    }
}

export const logOutUser = () => {
    return dispatch => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('member');
        sessionStorage.clear();
        setAuthorizationToken(false);
        dispatch(receiveLogout());
    }
}