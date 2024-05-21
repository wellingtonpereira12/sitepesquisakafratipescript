import axios from 'axios';
import { parseCookies } from 'nookies';
import { v4 as uuid } from 'uuid'
import { api } from './api';

type signInRequestData = {
    email: string;
    password: string;
} 

export async function signInRequest (data: signInRequestData){
    const response = await axios.post('https://teste-api-5421.onrender.com/loginkafra', data);
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


