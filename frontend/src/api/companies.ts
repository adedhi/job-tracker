import { apiFetch } from './client';
import {
    CompanyResponse,
    CompanyWithApplicationsResponse,
    CreateCompanyPayload,
    UpdateCompanyPayload
} from '@job-tracker/types';

export function fetchCompanies(): Promise<CompanyWithApplicationsResponse[]> {
    return apiFetch("/api/companies");
}

export function fetchCompany(id: string): Promise<CompanyWithApplicationsResponse> {
    return apiFetch(`/api/companies/${id}`);
}

export function createCompany(payload: CreateCompanyPayload): Promise<CompanyResponse> {
    return apiFetch("/api/companies", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

export function updateCompany(
    id: string,
    payload: UpdateCompanyPayload
): Promise<CompanyResponse> {
    return apiFetch(`/api/companies/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
    });
}

export function deleteCompany(id: string): Promise<{ message: string }> {
    return apiFetch(`/api/companies/${id}`, { method: "DELETE" });
}
