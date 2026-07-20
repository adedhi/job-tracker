import { useContext } from 'react';
import { DemoContext } from '../context/DemoContext';

export function useDemoMode() {
    const context = useContext(DemoContext);
    if (context === undefined) {
        throw new Error("useDemoMode must be used within a DemoProvider");
    }
    return context;
}
