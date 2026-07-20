import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useDemoMode } from '../hooks/useDemoMode';

export default function ProtectedRoute() {
    const { user, isLoading } = useAuth();
    const { isDemoMode } = useDemoMode();

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "calc(100vh - 64px)"
                }}
            >
                <CircularProgress size={100} />
            </Box>
        );
    }

    if (!user && !isDemoMode) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}