import { Navigate, Outlet } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div><CircularProgress /></div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}