import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000/api',
  withCredentials: true, // Important for sending/receiving cookies
});

export default instance;
