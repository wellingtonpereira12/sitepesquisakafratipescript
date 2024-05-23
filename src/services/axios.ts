import axios from "axios";
import { parseCookies } from "nookies";

export function getAPIClient(ctx?: any) {
  const { 'kafra.token': token } = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'https://teste-api-5421.onrender.com/'
  })

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  return api;
}