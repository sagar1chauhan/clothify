import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = (email, password) => {
        // Mock login capability
        // In a real app, this would make an API call
        if (email && password) {
            const mockUser = {
                id: 1,
                name: 'Test User',
                email: email,
                avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=150&q=80'
            };
            setUser(mockUser);
            return true;
        }
        return false;
    };

    const loginWithOTP = (mobile, otp) => {
        if (mobile.length === 10 && otp.length === 6) {
            const mockUser = {
                id: 1,
                name: 'Guest User',
                mobile: mobile,
                avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=150&q=80'
            };
            setUser(mockUser);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loginWithOTP }}>
            {children}
        </AuthContext.Provider>
    );
};
