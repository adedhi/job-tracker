import { useState } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    AppBar, Box, Button, Divider, Drawer, IconButton,
    List, ListItemButton, ListItemText, Skeleton, Tab,
    Tabs, Toolbar, Typography, useMediaQuery, useTheme
} from '@mui/material';
import { Menu as MenuIcon, Logout } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useDemoMode } from '../../hooks/useDemoMode';
import DemoBanner from '../../components/demo/DemoBanner';

const NAV_ITEMS = [
    { label: "Applications", path: "/" },
    { label: "Companies", path: "/companies" },
    { label: "Statistics", path: "/statistics" }
];

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user, logout, isLoading } = useAuth();
    const { isDemoMode, exitDemoMode } = useDemoMode();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const currentTab = NAV_ITEMS.some((item) => item.path === location.pathname)
        ? location.pathname
        : false;
    
    async function handleLogout() {
        if (isDemoMode) {
            exitDemoMode();
        } else {
            await logout();
        }
        navigate("/login");
    }

    function handleNavigate(path: string) {
        setDrawerOpen(false);
        navigate(path);
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={() => setDrawerOpen(true)}
                            sx={{ mr: 1 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" component="div" sx={{ mr: 4 }}>
                        Job Tracker
                    </Typography>
                    {!isMobile && (
                        <Tabs
                            value={currentTab}
                            textColor="inherit"
                            indicatorColor="secondary"
                            sx={{ flexGrow: 1, minWidth: "fit-content" }}
                        >
                            {NAV_ITEMS.map((item) => (
                                <Tab
                                    component={RouterLink}
                                    key={item.path}
                                    label={item.label}
                                    value={item.path}
                                    to={item.path}
                                    disabled={isLoading}
                                />
                            ))}
                        </Tabs>
                    )}
                    {isLoading ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {isMobile ? (
                                <Skeleton variant="rounded" width={24} height={24} sx={{ bgcolor: "#ffffff33" }} />
                            ) : (
                                <>
                                    <Skeleton variant="text" width={150} sx={{ bgcolor: "#ffffff33" }} />
                                    <Skeleton variant="rounded" width={80} height={36} sx={{ bgcolor: "#ffffff33" }} />
                                </>
                            )}
                        </Box>
                    ) : (
                        <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 0 : 2 }}>
                            <Typography variant="body2">
                                {user ? user.email : "Demo"}
                            </Typography>
                            {isMobile ? (
                                <IconButton color="inherit" onClick={handleLogout}>
                                    <Logout fontSize="small" />
                                </IconButton>
                            ) : (
                                <Button color="inherit" onClick={handleLogout}>
                                    Log out
                                </Button>
                            )}
                        </Box>
                    )}
                    {(user || isDemoMode) && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 0 : 2 }}>
                            {!isMobile && (
                                <Typography variant="body2">
                                    {user ? user.email : "Demo"}
                                </Typography>
                            )}
                        </Box>
                    )}
                    {!isMobile && <DemoBanner />}
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box role="presentation" sx={{ width: 240 }}>
                    <Typography variant="h6" sx={{ p: 2 }}>
                        Job Tracker
                    </Typography>
                    <Divider />
                    <List>
                        {NAV_ITEMS.map((item) => (
                            <ListItemButton
                                key={item.path}
                                selected={location.pathname === item.path}
                                onClick={() => handleNavigate(item.path)}
                            >
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
}