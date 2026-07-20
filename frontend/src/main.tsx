import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import './index.css';
import App from './App.tsx';
import { theme } from './theme';
import { AuthProvider } from './context/AuthContext.tsx';
import { DemoProvider } from './context/DemoContext.tsx';
import { SnackbarProvider } from './context/SnackbarContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <DemoProvider>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </DemoProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </StrictMode>,
)
