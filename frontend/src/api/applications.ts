import { apiFetch } from './client';
import {
    ApplicationResponse,
    CreateApplicationPayload,
    UpdateApplicationPayload
} from '@job-tracker/types';

export function fetchApplications(): Promise<ApplicationResponse[]> {
    return apiFetch("/api/applications");
}

export function fetchApplication(id: string): Promise<ApplicationResponse> {
    return apiFetch(`/api/applications/${id}`);
}

export function createApplication(payload: CreateApplicationPayload): Promise<ApplicationResponse> {
    return apiFetch("/api/applications", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

export function updateApplication(
    id: string,
    payload: UpdateApplicationPayload
): Promise<ApplicationResponse> {
    return apiFetch(`/api/applications/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
    });
}

export function deleteApplication(id: string): Promise<{ message: string }> {
    return apiFetch(`/api/applications/${id}`, { method: "DELETE" });
}
