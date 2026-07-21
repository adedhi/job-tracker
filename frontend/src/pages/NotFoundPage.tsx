import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

export default function NotFoundPage() {
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "60vh",
                    textAlign: "center"
                }}
            >
                <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                    404
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    Page Not Found
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    The page you're looking for doesn't exist or has been moved.
                </Typography>
                <Button
                    component={RouterLink}
                    to="/"
                    variant="contained"
                    size="large"
                >
                    Back to Dashboard
                </Button>
            </Box>
        </Container>
    );
}