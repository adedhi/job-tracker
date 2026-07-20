import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useDemoMode } from '../../hooks/useDemoMode';

export default function DemoButton() {
    const navigate = useNavigate();
    const { isDemoMode, exitDemoMode } = useDemoMode();

    function handleExitDemo() {
        exitDemoMode();
        navigate("/login");
    }

    if (!isDemoMode) return null;
    return (
        <Box sx={{ bgcolor: '#C98A2C', color: '#fff', px: 2, py: 0.5, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">Demo Mode — changes aren't saved</Typography>
            <Button size="small" color="inherit" onClick={handleExitDemo} sx={{ textDecoration: 'underline' }}>
            Log in to save your data
            </Button>
        </Box>
    );
}
