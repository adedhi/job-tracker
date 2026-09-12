import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Alert, CircularProgress, Container, Link, Paper, Typography } from '@mui/material';
import { verifyEmail } from '../api/auth';

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const hasRequestFired = useRef(false);

    useEffect(() => {
        if (hasRequestFired.current) return;
        hasRequestFired.current = true;

        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            return;
        }

        verifyEmail(token)
            .then(() => setStatus("success"))
            .catch(() => setStatus("error"));
    }, [searchParams]);

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4, textAlign: "center" }}>
                {status === "loading" && <CircularProgress />}
                {status === "success" && (
                    <>
                        <Typography variant="h5" gutterBottom>Email verified</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            You're all set. <Link component={RouterLink} to="/">Go to your dashboard</Link>.
                        </Typography>
                    </>
                )}
                {status === "error" && (
                    <Alert severity="error">This link is invalid or has expired.</Alert>
                )}
            </Paper>
        </Container>
    );
}
