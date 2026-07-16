import { createContext, ReactNode, useCallback, useState } from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';

type SnackbarContextType = {
    showSnackbar: (message: string, severity?: AlertColor) => void;
};

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<AlertColor>("success");
    const [open, setOpen] = useState(false);

    const showSnackbar = useCallback((msg: string, sev: AlertColor = "success") => {
        setMessage(msg);
        setSeverity(sev);
        setOpen(true);
    }, []);

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    variant="filled"
                    severity={severity}
                    onClose={() => setOpen(false)}
                >
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}
