import { createTheme } from '@mui/material';

export const STATUS_COLORS = {
    APPLIED: "#6B7A99",
    INTERVIEWING: "#C98A2C",
    REJECTED: "#2F8F5B",
    OFFER: "#2A6F6F",
    ACCEPTED: "#A6483A"
} as const;

export const theme = createTheme({
    palette: {
        background: { default: "#F7F8FA", paper: "#FFFFFF" },
        primary: { main: "#3D4B94" },
        text: { primary: "#1E2438", secondary: "#6B7280" },
        divider: "#D8DCE5",
    },
    typography: {
        fontFamily: '"Inter", sans-serif',
        h1: { fontFamily: '"Sora", sans-serif', fontWeight: 600 },
        h2: { fontFamily: '"Sora", sans-serif', fontWeight: 600 },
        h3: { fontFamily: '"Sora", sans-serif', fontWeight: 600 },
        h4: { fontFamily: '"Sora", sans-serif', fontWeight: 600 },
        h5: { fontFamily: '"Sora", sans-serif', fontWeight: 600 },
        h6: { fontFamily: '"Sora", sans-serif', fontWeight: 600 },
    },
    shape: { borderRadius: 8 },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: { backgroundColor: "#1E2438" },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: "none" },
            },
        },
    },
});