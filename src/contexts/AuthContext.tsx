import { recoverUserInformation, signInRequest } from "../services/auth";
import { setCookie, parseCookies } from 'nookies' // parseCookies devolve todos os cookies
import { useState, createContext, useEffect} from "react";
import Router from "next/router";
import { api } from "../services/api";


type User = {
    name: string;
    email: string;
    avatar_url: string;
}

type SignInData = {
    email: string,
    password: string,
}

type AuthContextType = {
    isAuthenticated: boolean;
    user: User;
    signIn: (data: SignInData) => Promise<void>
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

    async function signIn({ email, password}: SignInData) { // essa função tenho que jogar para o node processar
        const { token, user } = await signInRequest({
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

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}