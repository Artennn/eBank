import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    validateStatus: (status) => status < 500,
});

API.interceptors.response.use(response => response, error => {
    return {
        status: error.response.status,
        data: null
    }
})

export default API;