import { useState, useEffect, useMemo } from 'react';
import { CircularProgress, Container, Box, Button, Paper, Typography } from '@mui/material';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { ApplicationResponse } from '@job-tracker/types';
import { fetchApplications } from '../api/applications';
import { STATUS_COLORS } from '../theme';
import {
  computeStatusCounts, computeResponseRate, computeActiveCount,
  computeApplicationsOverTime, computeTopCompanies,
} from '../helpers/statistics';

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <Paper sx={{ flex: 1, minWidth: 180, p: 3 }}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="h4" sx={{ fontFamily: '"IBM Plex Mono", monospace', mt: 0.5 }}>
                {value}
            </Typography>
        </Paper>
    );
}

export default function StatisticsPage() {
    const [applications, setApplications] = useState<ApplicationResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const statusCounts = useMemo(() => computeStatusCounts(applications), []);
    const responseRate = useMemo(() => computeResponseRate(applications), []);
    const activeCount = useMemo(() => computeActiveCount(applications), []);
    const overTime = useMemo(() => computeApplicationsOverTime(applications), []);
    const topCompanies = useMemo(() => computeTopCompanies(applications), []);

    useEffect(() => {
        fetchApplications().then(setApplications).finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (applications.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ py: 8, textAlign: "center" }}>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        No data yet — add some applications to see your stats.
                    </Typography>
                    <Button variant="contained" href="/">
                        Go to Applications
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
                Statistics
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                <StatCard label="Total Applications" value={applications.length} />
                <StatCard label="Response Rate" value={`${responseRate}%`} />
                <StatCard label="Active in Pipeline" value={activeCount} />
            </Box>
            <Box
                sx={{
                    display: "grid",
                    gap: 2,
                    mb: 2,
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "1fr 1fr"
                    }
                }}
            >
                <Paper sx={{ p: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Pipeline by Stage
                    </Typography>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={statusCounts}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#D8DCE5" />
                            {/* Continue here */}
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            </Box>
        </Container>
    );
}