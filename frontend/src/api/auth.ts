import { apiFetch } from './client';
import { User } from '@job-tracker/types';

export function verifyEmail(token: string): Promise<{ message: string }> {
    return apiFetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
}

export function registerUser(email: string, password: string): Promise<User> {
    return apiFetch("/api/auth/register", {
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