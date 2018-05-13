import axios from 'axios';


function setAuthorizationToken(addHeader) {

    const token = localStorage.getItem('jwtToken');
    if (addHeader) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete axios.defaults.headers.common['Authorization']
    }
}

export default setAuthorizationToken;