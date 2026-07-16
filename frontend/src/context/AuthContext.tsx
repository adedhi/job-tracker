import { createContext, ReactNode, useEffect, useState } from 'react';
import { User } from '@job-tracker/types';
import { loginUser, registerUser, logoutUser, fetchCurrentUser } from '../api/auth';

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCurrentUser()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    async function login(email: string, password: string) {
        const loggedInUser = await loginUser(email, password);
        setUser(loggedInUser);
    }

    async function register(email: string, password: string) {
        const newUser = await registerUser(email, password);
        setUser(newUser);
    }

    async function logout() {
        await logoutUser();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}