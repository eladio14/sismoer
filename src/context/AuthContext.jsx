import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../utils/storageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        // Check for active session on load
        const storedUser = storageService.getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setIsInitializing(false);
    }, []);

    const login = async (email, password) => {
        try {
            const userData = await storageService.login(email, password);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const userData = await storageService.register(name, email, password);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        await storageService.logout();
        setUser(null);
    };

    const changePassword = async (userId, currentPassword, newPassword) => {
        try {
            await storageService.changePassword(userId, currentPassword, newPassword);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        loading: isInitializing,
        login,
        register,
        logout,
        changePassword,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {!isInitializing && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
