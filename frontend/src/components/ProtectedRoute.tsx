import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading, user } = useAuthStore();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        // Redirect to login if not authenticated or not an admin
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
