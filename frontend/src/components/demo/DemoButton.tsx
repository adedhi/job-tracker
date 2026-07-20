import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useDemoMode } from '../../hooks/useDemoMode';

export default function DemoButton() {
    const navigate = useNavigate();
    const { enterDemoMode } = useDemoMode();

    function handleTryDemo() {
        enterDemoMode();
        navigate("/");
    }

    return (
        <Button fullWidth variant="outlined" onClick={handleTryDemo} sx={{ mt: 2 }}>
            Try the demo - no account needed
        </Button>
    );
}
