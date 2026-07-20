import { useState, SubmitEvent } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Container,
    Link,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import DemoButton from '../components/demo/DemoButton';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isFormValid = email.trim().length > 0 && password.length > 0;

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate("/");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to log in");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Log in
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 2 }}
                >
                    <TextField
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                        autoComplete="email"
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                        autoComplete="current-password"
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={isSubmitting || !isFormValid}
                        sx={{ mt: 3 }}
                    >
                        {isSubmitting ? "Logging in..." : "Log in"}
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                        Don't have an account?{" "}
                        <Link component={RouterLink} to="/register">
                            Register
                        </Link>
                    </Typography>
                    <DemoButton />
                </Box>
            </Paper>
        </Container>
    );
}