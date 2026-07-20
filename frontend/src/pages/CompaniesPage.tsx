import { useState, useEffect, useMemo } from 'react';
import {
  Container, Box, Typography, Button, TextField, IconButton,
  Collapse, Table, TableHead, TableBody, TableRow, TableCell,
  TableSortLabel, Chip, InputAdornment, CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, Search, ExpandMore, ExpandLess } from '@mui/icons-material';
import { CompanyWithApplicationsResponse, CompanyResponse, ApplicationResponse } from '@job-tracker/types';
import { fetchCompanies, deleteCompany } from '../api/companies';
import { useSnackbar } from '../hooks/useSnackbar';
import { STATUS_COLORS } from '../theme';
import CompanyDialog from '../components/dialog/CompanyDialog';
import ApplicationDialog from '../components/dialog/ApplicationDialog';
import ConfirmDialog from '../components/dialog/ConfirmDialog';

type SortKey = keyof Pick<
    CompanyWithApplicationsResponse,
    "name" | "applications"
>;

export default function CompaniesPage() {
    const { showSnackbar } = useSnackbar();
    const [companies, setCompanies] = useState<CompanyWithApplicationsResponse[]>([]);
    const [search, setSearch] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [editingCompany, setEditingCompany] = useState<CompanyResponse | null>(null);
    const [editingApplication, setEditingApplication] = useState<ApplicationResponse | null>(null);
    const [companyToDelete, setCompanyToDelete] = useState<CompanyWithApplicationsResponse | null>(null);
    const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
    const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const filteredCompanies = useMemo(() => {
        let result = companies;

        if (search.trim()) {
            result = result.filter((company) =>
                company.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        return [...result].sort((a, b) => {
            let cmp = 0;
            switch (sortKey) {
                case "name": cmp = a.name.localeCompare(b.name); break;
                case "applications": cmp = a.applications.length - b.applications.length; break;
            }
            return sortDir === "asc" ? cmp : -cmp;
        });
    }, [companies, search, sortKey, sortDir]);

    async function loadCompanies() {
        setIsLoading(true);
        try {
            const companies = await fetchCompanies();
            setCompanies(companies);
        } finally {
            setIsLoading(false);
        }
    }

    async function confirmDelete() {
        if (!companyToDelete) return;
        try {
            await deleteCompany(companyToDelete.id);
            setCompanies((prev) => prev.filter((company) => company.id !== companyToDelete.id));
            setCompanyToDelete(null);
            showSnackbar("Company deleted");
        } catch (error) {
            showSnackbar(error instanceof Error ? error.message : "Failed to delete company", "error");
        }
    }

    function handleSort(key: SortKey) {
        if (sortKey === key) {
            setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    }

    function openCreateDialog() {
        setEditingCompany(null);
        setCompanyDialogOpen(true);
    }

    function openEditDialog(company: CompanyResponse) {
        setEditingCompany(company);
        setCompanyDialogOpen(true);
    }

    function openApplicationDialog(application: ApplicationResponse, company: CompanyWithApplicationsResponse) {
        const applicationWithCompany = {...application, company: { id: company.id, name: company.name }};
        setEditingApplication(applicationWithCompany);
        setApplicationDialogOpen(true);
    }

    useEffect(() => {
        loadCompanies();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3
                }}
            >
                <Typography variant="h5" component="h1">
                    Companies
                </Typography>
                <Button variant="contained" startIcon={<Add />} onClick={openCreateDialog}>
                    Add Company
                </Button>
            </Box>
            <TextField
                size="small"
                placeholder="Search companies"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setExpandedId(null);
                }}
                sx={{ mb: 2, minWidth: 240 }}
                slotProps={{
                    input: {
                        startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>
                    }
                }}
            />
            {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : companies.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        No companies yet — add one, or create it while adding an application.
                    </Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={openCreateDialog}>
                        Add Company
                    </Button>
                </Box>
            ) : filteredCompanies.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                    No companies match your search.
                </Typography>
            ) : (
                <Table
                    sx={{
                        border: 1,
                        borderColor:
                            "divider",
                            "& th, & td": {
                                border: 1,
                                borderColor: "divider"
                            },
                            "& th:first-of-type, & td:first-of-type": {
                                borderRight: "none"
                            },
                            "& th:nth-of-type(2), & td:nth-of-type(2)": {
                                borderLeft: "none"
                            }
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            {([
                                ["name", "Name"],
                                ["applications", "Applications"]
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
                        {filteredCompanies.map((company) => {
                            const isExpanded = expandedId === company.id;
                            return (
                                <>
                                    <TableRow key={company.id} hover>
                                        <TableCell sx={{ width: 48 }}>
                                            {company.applications.length > 0 && (
                                                <IconButton size="small" onClick={() => setExpandedId(isExpanded ? null : company.id)}>
                                                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                            )}
                                        </TableCell>
                                        <TableCell>{company.name}</TableCell>
                                        <TableCell>{company.applications.length}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => openEditDialog(company)}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => setCompanyToDelete(company)}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={4} sx={{ p: 0, border: isExpanded ? undefined : "none" }}>
                                            <Collapse in={isExpanded} unmountOnExit>
                                                <Box sx={{ px: 4, py: 2, bgcolor: "background.default" }}>
                                                    {company.applications.map((app) => (
                                                        <Box
                                                            key={app.id}
                                                            onClick={() => openApplicationDialog(app, company)}
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 2,
                                                                py: 1,
                                                                cursor: "pointer",
                                                                "&:hover": { opacity: 0.7 }
                                                            }}
                                                        >
                                                            <Chip
                                                                size="small"
                                                                label={app.status}
                                                                sx={{
                                                                    bgcolor: STATUS_COLORS[app.status],
                                                                    color: "#fff",
                                                                    minWidth: 100
                                                                }}
                                                            />
                                                            <Typography variant="body2">{app.roleTitle}</Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{
                                                                    ml: "auto",
                                                                    fontFamily: '"IBM Plex Mono", monospace'
                                                                }}
                                                            >
                                                                {new Date(app.appliedDate).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </>
                            );
                        })}
                    </TableBody>
                </Table>
            )}
            <CompanyDialog
                open={companyDialogOpen}
                company={editingCompany}
                onClose={() => setCompanyDialogOpen(false)}
                onSaved={loadCompanies}
            />
            <ApplicationDialog
                open={applicationDialogOpen}
                application={editingApplication}
                onClose={() => setApplicationDialogOpen(false)}
                onSaved={loadCompanies}
            />
            <ConfirmDialog
                open={companyToDelete !== null}
                title="Confirm Deletion"
                body={companyToDelete && companyToDelete?.applications?.length > 0
                    ? `"${companyToDelete.name}" has ${companyToDelete.applications.length} linked application${companyToDelete.applications.length > 1 ? "s" : ""}. Deleting it may affect those records. Continue?`
                    : `Delete "${companyToDelete?.name ?? ""}"? This cannot be undone.`
                }
                onConfirm={confirmDelete}
                onClose={() => setCompanyToDelete(null)}
            />
        </Container>
    );
}