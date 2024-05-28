import axios from 'axios';
import { parseCookies } from 'nookies';
import { v4 as uuid } from 'uuid'
import { api } from './api';

type signInRequestData = {
    email: string;
    password: string;
} 

type registerInRequestData = {
  nome: string,
  email: string,
  password: string,
} 


export async function signInRequest (data: signInRequestData){
    const response = await axios.post('http://localhost:3002/loginkafra', data);
    const token = response.data.resultado.token;
    const user = response.data.resultado.user;
    return { token, user };
}

export async function recoverUserInformation() {
  try {
  const response = await api.get('/validaToken');
  const user = response.data.resultado;
  return {         
    user
  };
} catch (error) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    };
}
}

export async function registroInRequest (data: registerInRequestData){
  try {
    console.log("registroInRequest")
    const response = await axios.post('http://localhost:3002/gravaNovoLogin', data);
    console.log("response")
    const token = response.data.resultado.token;
    const user = response.data.resultado.user;
    return { token, user };
  } catch (error)  {
    return {
      redirect: {
        destination: '/erro',
        permanent: false,
      }
    };
  }
}