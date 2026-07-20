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
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px",
                px: 2,
                py: 0.5,
                bgcolor: "#C98A2C",
                color: "#fff"
            }}
        >
            <Typography variant="body2">
                Demo Mode — changes aren't saved
            </Typography>
            <Button size="small" color="inherit" onClick={handleExitDemo} sx={{ textDecoration: "underline" }}>
                Log in to start tracking for real
            </Button>
        </Box>
    );
}
