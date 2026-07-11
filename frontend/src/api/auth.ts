import { apiFetch } from './client';
import { User } from '@job-tracker/types';

export function registerUser(email: string, password: string): Promise<User> {
    return apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
}

export function loginUser(email: string, password: string): Promise<User> {
    return apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
}

export function logoutUser(): Promise<void> {
    return apiFetch("/api/auth/logout", { method: "POST" });
}

export function fetchCurrentUser(): Promise<User> {
    return apiFetch("/api/auth/me");
}