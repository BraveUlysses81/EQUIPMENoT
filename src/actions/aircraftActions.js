import axios from 'axios'
import { server } from '../helpers/serverAddress'


export const getAllAircraft = (school_id) => {
    return () => {
        return axios.get(`${server}/schools/aircraft/${school_id}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}`} })
    }
};

export const getAircraftMakes = () => {
    return () => {
        return axios.get(`${server}/aircraft/makes`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}`} })
    }
};

export const getAircraftModels = (make) => {
    return () => {
        return axios.get(`${server}/aircraft/aircraft_model/model_ids/${make}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}`} })
    }
};

export const getAircraftEngines = (model) => {
    return () => {
        return axios.get(`${server}/aircraft/aircraft_model/engine/${model}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}`} })
    }
};

export const getSearchAircraft = (school_id, searchId) => {
    return () => {
        return axios.get(`${server}/aircraft/${school_id}/${searchId}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }})
    }
};

export const updateAircraft = (aircraft) => {
    return () => {
        return axios.put(`${server}/aircraft/${aircraft.aircraft_id}`, { aircraft },
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}`} })
    }
};

export const addAircraft = (school_id, aircraft) => {
    return () => {
        return axios.post(`${server}/aircraft/add/${school_id}`, { aircraft },
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }})
    }
};

export const updateAircraftStatus = (registration_nbr, aircraft_status, flightsToCancel) => {
    return () => {
        return axios.put(`${server}/aircraft/status/${registration_nbr}`, { aircraft_status, flightsToCancel },
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}`} }
        )
    }
};

export const getDispatchedFlights = (schoolId, registration_nbr) => {
    return () => {
        return axios.post(`${server}/school/flights/dispatched/${schoolId}`, { registration_nbr },
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}`} }
        )
    }
};



