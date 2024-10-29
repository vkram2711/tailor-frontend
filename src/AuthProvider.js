import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");

        if (token) {
            // Decode the token to get user information
            const decodedToken = jwtDecode(token);
            const expiryTime = decodedToken.exp * 1000;

            // Check if the token is still valid
            if (Date.now() < expiryTime) {
                setIsAuthenticated(true);
                setUser(decodedToken);
            } else {
                // Token is expired, clear sessionStorage
                sessionStorage.removeItem("authToken");
            }
        }
    }, []);

    const loginWithRedirect = (redirectUri = '/') => {
        // Redirect to your backend for login and get the token
        window.location.href = `http://localhost:8000/login?redirect_uri=${redirectUri}`;
    };

    const logout = () => {
        sessionStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setUser(null);
        navigate('/');
    };

    const getAccessTokenSilently = () => {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
            throw new Error("No token found in sessionStorage");
        }
        return token;
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                loginWithRedirect,
                logout,
                getAccessTokenSilently,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
