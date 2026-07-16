import { ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function ConfirmDialog({
    open,
    title,
    body,
    onConfirm,
    onClose
}: {
    open: boolean;
    title?: string;
    body: ReactNode;
    onConfirm: () => void;
    onClose: () => void;
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            {title && (
                <DialogTitle>
                    {title}
                </DialogTitle>
            )}
            <DialogContent sx={{ pt: 1 }}>
                {body}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={onConfirm}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}