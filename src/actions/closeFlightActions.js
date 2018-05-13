import axios from 'axios'
import { server } from '../helpers/serverAddress'

export const getFlight = (flightId) => {
    return () => {
        return axios.get(`${server}/flight/close/${flightId}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }}
        )
    }
};

export const getSquawks = (aircraft_id) => {
    return () => {
        return axios.get(`${server}/flight/squawks/${aircraft_id}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }}
        )
    }
};

export const newSquawk = (aircraft_id) => {
    return () => {
        return axios.post(`${server}/flight/squawk/new/${aircraft_id}`,
            {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}})
    }
};

export const getCompletedFlights = (school_id) => {
    return () => {
        return axios.get(`${server}/flight/completed/${school_id}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }}
        )
    }
};


