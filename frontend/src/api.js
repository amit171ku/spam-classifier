import axios from 'axios';

const api = axios.create({ 
    baseURL: 'https://spam-classifier-jvch.onrender.com'
});

export default api;