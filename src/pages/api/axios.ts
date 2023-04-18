import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const axiosInstance = axios.create();

export default axiosInstance;
