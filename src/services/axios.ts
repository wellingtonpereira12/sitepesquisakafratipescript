import axios from "axios";
import { parseCookies } from "nookies";

export function getAPIClient(ctx?: any) {
  const { 'kafra.token': token } = parseCookies(ctx)

  const api = axios.create({
    baseURL: process.env.linkApi
  })

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  return api;
}