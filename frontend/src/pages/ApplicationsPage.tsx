import { useState, useEffect, useMemo } from 'react';
import {
    Container, Box, Typography, Button, TextField, Chip,
    Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel,
    IconButton, InputAdornment, CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import { ApplicationResponse, ApplicationStatus } from '@job-tracker/types';
import { fetchApplications, deleteApplication } from '../api/applications';
import { STATUS_COLORS } from '../theme';
import ApplicationDialog from '../components/ApplicationDialog';

const STATUSES: ApplicationStatus[] = ["APPLIED", "INTERVIEWING", "REJECTED", "OFFER", "ACCEPTED"];
type SortKey = keyof Pick<
    ApplicationResponse,
    "roleTitle" | "company" | "status" | "appliedDate" | "salary"
>;

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<ApplicationResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeStatuses, setActiveStatuses] = useState<Set<ApplicationStatus>>(new Set());
    const [sortKey, setSortKey] = useState<SortKey>("appliedDate");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingApplication, setEditingApplication] = useState<ApplicationResponse | null>(null);

    const filteredApplications = useMemo(() => {
        let result = applications;

        if (search.trim()) {
            result = result.filter((app) =>
                app.roleTitle.toLowerCase().includes(search.toLowerCase()) ||
                app.company?.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (activeStatuses.size > 0) {
            result = result.filter((app) => activeStatuses.has(app.status));
        }

        return [...result].sort((a, b) => {
            let cmp = 0;
            switch (sortKey) {
                case "roleTitle": cmp = a.roleTitle.localeCompare(b.roleTitle); break;
                case "company": cmp = (a.company?.name ?? "").localeCompare(b.company?.name ?? ""); break;
                case "status": cmp =a.status.localeCompare(b.status); break;
                case "appliedDate": cmp = new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime(); break;
                case "salary": cmp = (a.salary ?? "").localeCompare(b.salary ?? ""); break;
            }
            return sortDir === "asc" ? cmp : -cmp;
        });
    }, [applications, search, activeStatuses, sortKey, sortDir]);

    async function loadApplications() {
        setIsLoading(true);
        try {
            const data = await fetchApplications();
            setApplications(data);
        } finally {
            setIsLoading(false);
        }
    }

    function toggleStatus(status: ApplicationStatus) {
        setActiveStatuses((prev) => {
            const next = new Set(prev);
            next.has(status) ? next.delete(status) : next.add(status);
            return next;
        });
    }

    function handleSort(key: SortKey) {
        if (sortKey === key) {
            setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this application? This cannot be undone.")) return;
        await deleteApplication(id);
        setApplications((prev) => prev.filter((a) => a.id !== id));
    }

    function openCreateDialog() {
        setEditingApplication(null);
        setDialogOpen(true);
    }

    function openEditDialog(application: ApplicationResponse) {
        setEditingApplication(application);
        setDialogOpen(true);
    }

    useEffect(() => {
        loadApplications();
    }, [])

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Applications
                </Typography>
                <Button variant="contained" startIcon={<Add />} onClick={openCreateDialog}>
                    Add Application
                </Button>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, mb: 2 }}>
                <TextField
                    size="small"
                    placeholder="Search role or company"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ minWidth: 240 }}
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>
                        }
                    }}
                />
                {STATUSES.map((status) => (
                    <Chip
                        key={status}
                        label={status}
                        onClick={() => toggleStatus(status)}
                        sx={{
                            bgcolor: activeStatuses.has(status) ? STATUS_COLORS[status] : "transparent",
                            color: activeStatuses.has(status) ? "#FFF" : STATUS_COLORS[status],
                            border: `1px solid ${STATUS_COLORS[status]}`,
                            fontWeight: 500
                        }}
                    />
                ))}
            </Box>
            {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : filteredApplications.length === 0 && applications.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        No applications yet — add your first one to start tracking.
                    </Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={openCreateDialog}>
                        Add Application
                    </Button>
                </Box>
            ) : filteredApplications.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                    No applications match your filters.
                </Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            {([
                                ["roleTitle", "Role"],
                                ["company", "Company"],
                                ["status", "Status"],
                                ["appliedDate", "Applied"],
                                ["salary", "Salary"]
                            ] as [SortKey, string][]).map(([key, label]) => (
                                <TableCell key={key}>
                                    <TableSortLabel
                                        active={sortKey === key}
                                        direction={sortKey === key ? sortDir : "asc"}
                                        onClick={() => handleSort(key)}
                                    >
                                        {label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell align="right">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredApplications.map((app) => (
                            <TableRow
                                key={app.id}
                                hover
                                onClick={() => openEditDialog(app)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell>{app.roleTitle}</TableCell>
                                <TableCell>{app.company?.name ?? '—'}</TableCell>
                                <TableCell>
                                    <Chip
                                        size="small"
                                        label={app.status}
                                        sx={{
                                            bgcolor: STATUS_COLORS[app.status],
                                            color: "#FFF",
                                            fontWeight: 500
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: "0.85rem" }}>
                                    {new Date(app.appliedDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: "0.85rem" }}>
                                    {app.salary ?? '—'}
                                </TableCell>
                                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                                    <IconButton size="small" onClick={() => openEditDialog(app)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(app.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            <ApplicationDialog
                open={dialogOpen}
                application={editingApplication}
                onClose={() => setDialogOpen(false)}
                onSaved={loadApplications}
            />
        </Container>
    );
}