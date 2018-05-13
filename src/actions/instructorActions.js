import axios from 'axios';
import { server } from '../helpers/serverAddress'

export const instructorQuickAddRequest = (userData, school_id) => {
    return () => {
        return axios.post(`${server}/signup/short/${school_id}`, userData)
    }
}

export const getAllInstructors = (school_id) => {
    return () => {
        return axios.get(`${server}/school/instructors/${school_id}`,
            { headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}}
        )
    }
};

export const updateInstructor = (instructor) => {
    return () => {
        return axios.put(`${server}/customers/contact/${instructor.person_id}`, instructor,
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}})

    }
};