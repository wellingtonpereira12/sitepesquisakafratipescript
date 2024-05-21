import axios from "axios";
import { parseCookies } from "nookies";


const { 'kafra.token': token } = parseCookies()

export const api = axios.create({
    baseURL: 'http://localhost:3000' // https://sitepesquisakafra-web-service.onrender.com
})

api.interceptors.request.use(config => {
    console.log(config);

    return config;
})

if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
}
