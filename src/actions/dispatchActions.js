import axios from 'axios'
import { server } from '../helpers/serverAddress'


export const getAircraft = (school_id) => {
    return () => {
        return axios.get(`${server}/schools/aircraft/${school_id}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }} )
    }
};

export const getInstructors = (school_id) => {
    return () => {
        return axios.get(`${server}/school/instructors/${school_id}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }})
    }
};

export const postFlight = (selectedDispatchAircraft, selectedDispatchCustomer, selectedDispatchInstructor, flight) => {
    return () => {
        return axios.post(`${server}/flight/${selectedDispatchAircraft.school_id}/${selectedDispatchAircraft.aircraft_id}`, {
            customer_id: selectedDispatchCustomer.person_id,
            aircraft_id: selectedDispatchAircraft.aircraft_id,
            instructor_id: selectedDispatchInstructor.person_id,
            school_id: selectedDispatchCustomer.school_id,
            flight_type: flight.flightType,
            crossCountry: flight.crossCountry
        },
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }})
    }
};

