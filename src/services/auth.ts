import { v4 as uuid } from 'uuid'

type signInRequestData = {
    email: string;
    password: string;
} 

export async function signInRequest (data: signInRequestData){
    return {
        token: uuid(),
        user: {
            name: 'Wellington Pereira',
            email: 'lleco12@gmail.com',
            avatar_url: 'https://github.com/wellingtonpereira12.png'
        }
    }
}

export async function recoverUserInformation() {
    return {
      user: {
        name: 'Wellington Pereira',
        email: 'lleco12@gmail.com',
        avatar_url: 'https://github.com/wellingtonpereira12.png'
      }
    }
  }