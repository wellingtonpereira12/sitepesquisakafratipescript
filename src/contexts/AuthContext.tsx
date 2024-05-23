import { recoverUserInformation, signInRequest, registroInRequest } from "../services/auth";
import { setCookie, parseCookies } from 'nookies' // parseCookies devolve todos os cookies
import { useState, createContext, useEffect} from "react";
import Router from "next/router";
import { api } from "../services/api";


type User = {
    name: string;
    email: string;
    avatar_url: string;
    objProcura;
    objAlerta;
}

type SignInData = {
    email: string,
    password: string,
}

type RegisterInData = {
    nome: string,
    email: string,
    password: string,
}

type AuthContextType = {
    isAuthenticated: boolean;
    user: User;
    signIn: (data: SignInData) => Promise<void>;
    registerIn: (data: RegisterInData) => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }) {
    const [user, setUser] = useState<User | null>(null);

    const isAuthenticated = !!user;

    useEffect(() => {
        const { 'kafra.token': token } = parseCookies()
        if (token) {
          recoverUserInformation().then(response => { //essa fução para node
            setUser(response.user)
          })
        }
      }, [])

    async function signIn({ email, password}: SignInData) { 
        const { token, user } = await signInRequest({ // essa função tenho que jogar para o node processar
            email,
            password
        });
        
        setCookie(undefined, 'kafra.token', token, {
            maxAge: 60 * 60 * 1, // 1 hora  
        });

        api.defaults.headers['Authorization'] = `Bearer ${token}`;

        setUser(user);
        Router.push('/dashboard');
    }

    async function registerIn({ email, password, nome}: RegisterInData) { 
        console.log("registerIn");
        const { token, user } = await registroInRequest({ 
            nome,
            email,
            password
        });

        if (token) {
            console.log("registerIn1",token);
            setCookie(undefined, 'kafra.token', token, {
                maxAge: 60 * 60 * 1, // 1 hora  
            });
            console.log("registerIn2");
            api.defaults.headers['Authorization'] = `Bearer ${token}`;
            console.log("registerIn3");
            setUser(user);
            console.log("registerIn4");
            Router.push('/dashboard');
        } else {
            Router.push('/registro#');
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn,  registerIn}}>
            {children}
        </AuthContext.Provider>
    )
}
