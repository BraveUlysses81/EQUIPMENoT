import axios from 'axios'
import { server } from '../helpers/serverAddress'

export const getCustomers = (school_id) => {
    return () => {
        return axios.get(`${server}/customers/all/${school_id}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }})
    }
};

export const updateCustomer = (customer) => {
    return () => {
        return axios.put(`${server}/customers/contact/${customer.person_id}`, customer,
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}})

    }
};

export const memberQuickAddRequest = (userData, school_id) => {
    return () => {
        return axios.post(`${server}/signup/short/${school_id}`, userData)
    }
};

export const getCustomerDocuments = (membership_id, person_id) => {
    return () => {
        return axios.all([
            axios.get(`${server}/membership/checkouts/${membership_id}`),
            axios.get(`${server}/membership/documents/${person_id}`)
        ], )
    }
};







