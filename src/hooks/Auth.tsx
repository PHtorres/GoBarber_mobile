import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';

interface AuthState {
    token: string;
    user: User;
}

interface SignInCredentials {
    email: string;
    password: string;
}

interface User {
    id:string;
    name:string;
    email:string;
    avatar_url:string;
}

interface IAuthContext {
    user: User;
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void;
    loading: boolean;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC = ({ children }) => {

    const [data, setData] = useState<AuthState>({} as AuthState);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadStorageData() }, []);

    async function loadStorageData(): Promise<void> {

        const token = await AsyncStorage.getItem('@GoBarber:token');
        const user = await AsyncStorage.getItem('@GoBarber:user');
        
        if (token && user) {
            api.defaults.headers.authorization = `Bearer ${token}`;
            setData({ token, user: JSON.parse(user) });
        }

        setLoading(false);
    }

    const signIn = useCallback(async ({ email, password }) => {

        const response = await api.post('sessions', { email, password });
        const { token, user } = response.data;

        await AsyncStorage.setItem('@GoBarber:token', token);
        await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

        api.defaults.headers.authorization = `Bearer ${token}`;

        setData({ token, user });

    }, []);

    const signOut = useCallback(async () => {

        await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

        setData({} as AuthState);

    }, []);

    return (
        <AuthContext.Provider value={{ user: data.user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): IAuthContext => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}