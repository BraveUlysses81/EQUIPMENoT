import axios from 'axios'
import { server } from '../helpers/serverAddress'

export const getCustomerProfile = (person_id) => {
    return () => {
        return axios.get(`${server}/person/${person_id}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }})
    }
};

export const getMemberships = (person_id) => {
    return () => {
        return axios.get(`${server}/memberships/all/${person_id}`,
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}}
        )
    }
};

export const updateProfileAddress = (customer) => {
    return () => {
        return axios.put(`${server}/customers/profile/address`, customer,
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}})

    }
};

export const updateEmergencyContact = (user) => {
    return () => {
        return axios.put(`${server}/customers/profile/emergencycontact`, user,
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}})

    }
};

export const updateContact = (user) => {
    return () => {
        return axios.post(`${server}/customers/profile/contact`, user,
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}})
    }
};

export const updateUser = (user) => {
    return () => {
        return axios.post(`${server}/login/modify`, user,
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}}
        )
    }
};

export const getNonMemberSchools = (person_id) => {
    return () => {
        return axios.get(`${server}/memberships/schools/nonmember/${person_id}`,
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}}
        )
    }
};

export const requestNewMembership = (person_id, school_id, user) => {
    return () => {
        return axios.post(`${server}/membership/invite/request/${person_id}/${school_id}`, user,
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}}
        )
    }
};

export const uploadProfileImage = (person_id, contentType, image) => {
    return () => {
        return axios.post(`${server}/person/photo/${person_id}`, {contentType, image},
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}}
        )
    }
};
