import { useState, useEffect, SubmitEvent } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Autocomplete, Box, Typography,
  createFilterOptions,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import {
  ApplicationResponse,
  ApplicationStatus,
  CompanyResponse,
} from '@job-tracker/types';
import { createApplication, updateApplication } from '../api/applications';
import { fetchCompanies, createCompany } from '../api/companies';

const STATUSES: ApplicationStatus[] = ["APPLIED", "INTERVIEWING", "REJECTED", "OFFER", "ACCEPTED"];

const EXPLICIT_CREATE = { id: "__explicit_create__", name: "Add new company" };
type CompanyOption = CompanyResponse | typeof EXPLICIT_CREATE;

const filter = createFilterOptions<CompanyOption>();

export default function ApplicationsDialog({
    open,
    application,
    onClose,
    onSaved
}: {
  open: boolean;
  application: ApplicationResponse | null;
  onClose: () => void;
  onSaved: () => void;
}) {
    const [roleTitle, setRoleTitle] = useState("");
    const [status, setStatus] = useState<ApplicationStatus>("APPLIED");
    const [jobUrl, setJobUrl] = useState("");
    const [salary, setSalary] = useState("");
    const [companies, setCompanies] = useState<CompanyResponse[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<CompanyResponse | null>(null);
    const [companyInput, setCompanyInput] = useState("");
    const [newCompanyName, setNewCompanyName] = useState("");
    const [newCompanyDialogOpen, setNewCompanyDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCreatingCompany, setIsCreatingCompany] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = application !== null;
    const isFormValid = roleTitle.trim().length > 0;

    function openNewCompanyDialog(prefill: string) {
        setNewCompanyName(prefill);
        setNewCompanyDialogOpen(true);
    }

    async function handleCompanyChange(value: CompanyOption | string | null) {
        if (value === null) {
            setSelectedCompany(null);
            return;
        }

        if (typeof value === "string") {
            openNewCompanyDialog(value);
            return;
        }

        if (value.id === EXPLICIT_CREATE.id) {
            openNewCompanyDialog(companyInput);
            return;
        }

        setSelectedCompany(value as CompanyResponse);
    }

    async function handleCreateCompany() {
        if (!newCompanyName.trim()) return;
        setIsCreatingCompany(true);

        try {
            const created = await createCompany({ name: newCompanyName.trim() });
            setCompanies((prev) => [...prev, created]);
            setSelectedCompany(created);
            setCompanyInput(created.name);
            setNewCompanyDialogOpen(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to create company");
        } finally {
            setIsCreatingCompany(false);
        }
    }

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const payload = {
            roleTitle: roleTitle.trim(),
            status,
            jobUrl: jobUrl.trim() || undefined,
            salary: salary.trim() || undefined,
            companyId: selectedCompany?.id
        };

        try {
            if (isEditing) {
                await updateApplication(application.id, payload);
            } else {
                await createApplication(payload);
            }
            onSaved();
            onClose();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to save application");
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (!open) return;
        fetchCompanies().then(setCompanies);
        setRoleTitle(application?.roleTitle ?? "");
        setStatus(application?.status ?? "APPLIED");
        setJobUrl(application?.jobUrl ?? "");
        setSalary(application?.salary ?? "");
        setSelectedCompany(application?.company ?? null);
        setCompanyInput(application?.company?.name ?? "");
        setError(null);
    }, [open, application]);

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {isEditing ? "Edit Application" : "Add Application"}
                </DialogTitle>
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2.5,
                            pt: 1
                        }}
                    >
                        <TextField
                            label="Role title"
                            value={roleTitle}
                            onChange={(e) => setRoleTitle(e.target.value)}
                            required
                            fullWidth
                            autoFocus
                        />
                        <Autocomplete<CompanyOption, false, false, true>
                            freeSolo
                            options={companies}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params) as CompanyOption[];
                                return [...filtered, EXPLICIT_CREATE];
                            }}
                            getOptionLabel={(option) => (typeof option === "string" ? option : option.name)}
                            value={selectedCompany}
                            inputValue={companyInput}
                            onInputChange={(_, value) => setCompanyInput(value)}
                            onChange={(_, value) => handleCompanyChange(value)}
                            renderOption={(props, option) => (
                                <Box component="li" {...props} key={option.id}>
                                    {option.id === EXPLICIT_CREATE.id ? (
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                                color: "primary.main"
                                            }}
                                        >
                                            <Add fontSize="small" /> {option.name}
                                        </Typography>
                                    ) : (
                                        option.name
                                    )}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField {...params} label="Company" placeholder="Search or add a company" />
                            )}
                        />
                        <TextField
                            select
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                            fullWidth
                        >
                            {STATUSES.map((s) => (
                                <MenuItem key={s} value={s}>{s}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Job URL"
                            value={jobUrl}
                            onChange={(e) => setJobUrl(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Salary"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            fullWidth
                            placeholder="e.g. $100,000"
                        />
                        {error && <Typography color="error" variant="body2">{error}</Typography>}
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting || !isFormValid}
                        >
                            {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Add Application"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
            <Dialog
                open={newCompanyDialogOpen}
                onClose={() => setNewCompanyDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Add Company</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="Company name"
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        fullWidth
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setNewCompanyDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateCompany}
                        disabled={isCreatingCompany || !newCompanyName.trim()}
                    >
                        {isCreatingCompany ? "Adding..." : "Add Company"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}