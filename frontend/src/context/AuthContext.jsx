import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

const TOKEN_KEY = 'projenitor_token';
const USER_KEY = 'projenitor_user';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hydrate from cookie/localStorage on mount
    useEffect(() => {
        const savedToken = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
        const savedUser = localStorage.getItem(USER_KEY);
        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch {
                // corrupt state
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        // Store in both cookie and localStorage
        Cookies.set(TOKEN_KEY, newToken, { expires: 7, sameSite: 'Lax' });
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        Cookies.remove(TOKEN_KEY);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    };

    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
    const isSuperAdmin = user?.role === 'superadmin';

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAdmin, isSuperAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export default AuthContext;
