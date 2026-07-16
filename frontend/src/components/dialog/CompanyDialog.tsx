import { useState, useEffect, SubmitEvent } from 'react';
import {
    Box, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Button, Typography
} from '@mui/material';
import { CompanyResponse } from '@job-tracker/types';
import { createCompany, updateCompany } from '../../api/companies';
import { useSnackbar } from '../../hooks/useSnackbar';

export default function CompanyDialog({
    open,
    company,
    initialName,
    onClose,
    onSaved
}: {
    open: boolean;
    company: CompanyResponse | null;
    initialName?: string;
    onClose: () => void;
    onSaved: (company: CompanyResponse) => void;
}) {
    const { showSnackbar } = useSnackbar();
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = company !== null;

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        if (!name.trim) return;
        setError(null);
        setIsSubmitting(true);

        try {
            const saved = isEditing
                ? await updateCompany(company.id, { name: name.trim() })
                : await createCompany({ name: name.trim() });
            onSaved(saved);
            onClose();
            showSnackbar(isEditing ? "Company updated" : "Company added");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to save company");
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (!open) return;
        setName(company?.name ?? initialName ?? "");
        setError(null);
    }, [open, company]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>
                {isEditing ? "Edit Company" : "Add Company"}
            </DialogTitle>
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ pt: 1 }}>
                    <TextField
                        autoFocus
                        label="Company name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                    />
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || !name.trim()}
                    >
                        {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Add Company"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
