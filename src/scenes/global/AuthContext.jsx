import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom';

// Create the AuthContext with default values
export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: (token) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // State to hold authentication status and user information
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Function to handle login
  const login = (token) => {
    try {
      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Decode the token to get user information
      const decodedToken = jwtDecode(token);

      // Update state
      setIsAuthenticated(true);
      setUser({
        user_token: token,
        user_name: decodedToken.user_name || decodedToken.userName || 'User', // Fixed typo
        user_role_id: decodedToken.user_role_id || 2, // Adjust based on your token's payload
        user_id: decodedToken.user_id || '', // Add other relevant user information here
      });

      // Optionally, navigate to a protected route after login
      navigate('/');
    } catch (error) {
      console.error('Invalid token during login:', error);
      // Handle token decoding errors, possibly logout or show an error message
      logout();
    }
  };

  // Function to handle logout
  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');

    // Reset state
    setIsAuthenticated(false);
    setUser(null);

    // Redirect to login page
    navigate('/login');
  };

  // Effect to check authentication status on initial render
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Decode the token to get user information
        const decodedToken = jwtDecode(token);

        // Optional: Check token expiration
        const currentTime = Date.now() / 1000; // in seconds
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Token has expired
          console.warn('Token has expired.');
          logout();
        } else {
          // Token is valid
          setIsAuthenticated(true);
          setUser({
            user_token: token,
            user_name: decodedToken.user_name || decodedToken.userName || 'User', // Fixed typo
            user_role_id: decodedToken.user_role_id || 2, // Adjust based on your token's payload
            user_id: decodedToken.user_id || '', // Add other relevant user information here
          });
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        // If token is invalid, remove it and navigate to login
        logout();
      }
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};