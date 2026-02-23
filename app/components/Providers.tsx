'use client';

import { ReactNode, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '../store/reduxStore';

/**
 * Material UI Theme configuration.
 * Defines the application's color palette, typography, and component defaults.
 */
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#111111' },
        secondary: { main: '#555555' },
        background: { default: '#ffffff', paper: '#ffffff' },
        error: { main: '#ef4444' },
    },
    typography: {
        fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    },
    shape: { borderRadius: 8 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', fontWeight: 600 },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: { borderRadius: 12 },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: '#fafafa',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#111111',
                    },
                },
            },
        },
    },
});

/**
 * Root Providers component.
 * Wraps the application with Redux, React Query, and Material UI context providers.
 */
export default function Providers({ children }: { children: ReactNode }) {
    // Create queryClient instance once per application lifecycle
    const [queryClient] = useState(() => new QueryClient());

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                    {/* Toast notifications handler */}
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            duration: 2800,
                            style: { fontFamily: 'inherit', fontSize: '13px', fontWeight: 500 },
                        }}
                    />
                </ThemeProvider>
            </QueryClientProvider>
        </Provider>
    );
}
