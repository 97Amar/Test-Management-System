import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@constants/constants';

interface PrivateRouteProps {
    children: React.ReactNode;
}

/**
 * A wrapper component for protected routes.
 * Redirects to the login page if the user is not authenticated.
 */
const PrivateRoute = ({ children }: PrivateRouteProps) => {
    // Check for authentication token 
    const token = localStorage.getItem('token');

    const isAuthenticated = !!token;

    return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
};

export default PrivateRoute;
