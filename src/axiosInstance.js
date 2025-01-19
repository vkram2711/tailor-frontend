import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_BASE_URL, // Replace with your actual base URL
});

export default axiosInstance;