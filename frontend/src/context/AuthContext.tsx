// /frontend/src/context/AuthContext.tsx
import React, { createContext, useState, useContext } from 'react';

// Define the type for our simple user profile
interface UserProfile {
    id: string;
    name: string;
    role: 'user' | 'admin';
}

interface AuthContextType {
    user: UserProfile | null;
    login: (name: string, role: 'user' | 'admin') => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);

    const login = (name: string, role: 'user' | 'admin') => {
        setUser({ 
            id: `user-${Date.now()}`, 
            name: name,
            role,
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        // This is the error message that React sees and throws
        throw new Error('useAuth must be used within an AuthProvider'); 
    }
    return context;
};

// Final module export fix
export {};