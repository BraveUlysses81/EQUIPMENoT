import axios from 'axios'
import { server } from '../helpers/serverAddress'


export const getInviteMembership = (invite_id) => {
    return () => {
        return axios.get(`${server}/membership/invite/${invite_id}`,
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}}
        )
    }
};

export const getAllInvites = (school_id) => {
    return () => {
        return  axios.get(`${server}/membership/invites/all/${school_id}`,
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}}
        )
    }
};

export const getAllUsers = (school_id) => {
    return () => {
        return  axios.get(`${server}/memberships/roles/all/${school_id}`,
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}}
        )
    }
};

export const updateInvite = (user) => {
    return () => {
        return axios.post(`${server}/membership/invite/${user.school_id}/${user.invite_id}`, user,
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}}
        )
    }
};

export const updateUserPermissions = (school_id, user) => {
    return () => {
        return axios.put(`${server}/membership/permissions/${school_id}/${user.person_id}`, user,
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}}
        )
    }
};

export const resendInvite = (user) => {
    return () => {
        return axios.post(`${server}/login/resend/${user.invite_id}`, user,
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}})

    }
};