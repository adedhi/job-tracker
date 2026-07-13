import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    AppBar,
    Box,
    Button,
    Tab,
    Tabs,
    Toolbar,
    Typography
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
    { label: "Applications", path: "/" },
    { label: "Companies", path: "/companies" },
    { label: "Statistics", path: "/statistics" }
];

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const currentTab = NAV_ITEMS.some((item) => item.path === location.pathname)
        ? location.pathname
        : false;
    
    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ mr: 4 }}>
                    Job Tracker
                </Typography>
                <Tabs
                    value={currentTab}
                    textColor="inherit"
                    indicatorColor="secondary"
                    sx={{ flexGrow: 1 }}
                >
                    {NAV_ITEMS.map((item) => (
                        <Tab
                            component={RouterLink}
                            key={item.path}
                            label={item.label}
                            value={item.path}
                            to={item.path}
                        />
                    ))}
                </Tabs>
                {user && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="body2">
                            {user.email}
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Log out
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}