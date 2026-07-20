import { createContext, ReactNode, useCallback, useState } from 'react';
import {
    ApplicationResponse, CompanyResponse, CompanyWithApplicationsResponse,
    CreateApplicationPayload, CreateCompanyPayload, UpdateApplicationPayload,
    UpdateCompanyPayload
} from '@job-tracker/types';
import { getSeedApplications, getSeedCompanies } from '../helpers/demoData';

type DemoContextType = {
    isDemoMode: boolean;
    enterDemoMode: () => void;
    exitDemoMode: () => void;

    fetchApplications: () => Promise<ApplicationResponse[]>;
    fetchApplication: (id: string) => Promise<ApplicationResponse>;
    createApplication: (payload: CreateApplicationPayload) => Promise<ApplicationResponse>;
    updateApplication: (id: string, payload: UpdateApplicationPayload) => Promise<ApplicationResponse>;
    deleteApplication: (id: string) => Promise<{ message: string }>;

    fetchCompanies: () => Promise<CompanyWithApplicationsResponse[]>;
    fetchCompany: (id: string) => Promise<CompanyWithApplicationsResponse>;
    createCompany: (payload: CreateCompanyPayload) => Promise<CompanyResponse>;
    updateCompany: (id: string, payload: UpdateCompanyPayload) => Promise<CompanyResponse>;
    deleteCompany: (id: string) => Promise<{ message: string }>;
};

export const DemoContext = createContext<DemoContextType | undefined>(undefined);

// Replicates the backend/database CRUD operations in React state
export function DemoProvider({ children }: { children: ReactNode }) {
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [applications, setApplications] = useState<ApplicationResponse[]>([]);
    const [companies, setCompanies] = useState<CompanyResponse[]>([]);

    const enterDemoMode = useCallback(() => {
        setCompanies(getSeedCompanies());
        setApplications(getSeedApplications());
        setIsDemoMode(true);
    }, []);

    const exitDemoMode = useCallback(() => {
        setIsDemoMode(false);
        setCompanies([]);
        setApplications([]);
    }, []);

    function attachCompany(app: ApplicationResponse, companyList: CompanyResponse[]): ApplicationResponse {
        return { ...app, company: companyList.find((company) => company.id === app.companyId) ?? null };
    }

    function withApplications(company: CompanyResponse, appList: ApplicationResponse[]): CompanyWithApplicationsResponse {
        return { ...company, applications: appList.filter((app) => app.companyId === company.id) };
    }

    const fetchApplications = useCallback(async () => applications, [applications]);

    const fetchApplication = useCallback(async (id: string) => {
        const application = applications.find((app) => app.id === id);
        if (!application) throw new Error("Application not found");
        return application
    }, [applications]);

    const createApplication = useCallback(async (payload: CreateApplicationPayload) => {
        const now = new Date().toISOString();
        const newApp: ApplicationResponse = {
            id: crypto.randomUUID(),
            roleTitle: payload.roleTitle,
            status: payload.status,
            jobUrl: payload.jobUrl ?? null,
            salary: payload.salary ?? null,
            companyId: payload.companyId ?? null,
            appliedDate: now,
            updatedAt: now,
        };
        const withCompany = attachCompany(newApp, companies);
        setApplications((prev) => [...prev, withCompany]);
        return withCompany;
    }, [companies]);

    const updateApplication = useCallback(async (id: string, payload: UpdateApplicationPayload) => {
        let updated: ApplicationResponse | undefined;
        setApplications((prev) => prev.map((app) => {
            if (app.id !== id) return app;
            updated = attachCompany({ ...app, ...payload, updatedAt: new Date().toISOString() }, companies);
            return updated;
        }));
        if (!updated) throw new Error("Application not found");
        return updated;
    }, [companies]);

    const deleteApplication = useCallback(async (id: string) => {
        setApplications((prev) => prev.filter((app) => app.id !== id));
        return { message: "Application deleted" };
    }, []);

    const fetchCompanies = useCallback(async () =>
        companies.map((company) => withApplications(company, applications)),
        [companies, applications]);

    const fetchCompany = useCallback(async (id: string) => {
        const company = companies.find((company) => company.id === id);
        if (!company) throw new Error("Company not found");
        return withApplications(company, applications);
    }, [companies, applications]);

    function assertUniqueName(name: string, excludeId?: string) {
        const existingCompany = companies.some(
            (company) => company.id !== excludeId && company.name.trim().toLowerCase() === name.trim().toLowerCase()
        );
        if (existingCompany) throw new Error("You already have a company with this name");
    }

    const createCompany = useCallback(async (payload: CreateCompanyPayload) => {
        assertUniqueName(payload.name);
        const newCompany: CompanyResponse = {
            id: crypto.randomUUID(),
            name: payload.name.trim()
        };
        setCompanies((prev) => [...prev, newCompany]);
        return newCompany;
    }, [companies]);

    const updateCompany = useCallback(async (id: string, payload: UpdateCompanyPayload) => {
        if (payload.name !== undefined) assertUniqueName(payload.name, id);
        let updated: CompanyResponse | undefined;
        setCompanies((prev) => prev.map((company) => {
            if (company.id !== id) return company;
            updated = { ...company, ...payload };
            return updated;
        }));
        if (!updated) throw new Error("Company not found");
        return updated;
    }, [companies]);

    const deleteCompany = useCallback(async (id: string) => {
        setCompanies((prev) => prev.filter((company) => company.id !== id));
        setApplications((prev) => prev.map((app) => (app.companyId === id ? { ...app, companyId: null, company: null } : app)));
        return { message: "Company deleted" };
    }, []);

    return (
        <DemoContext.Provider value={{
            isDemoMode, enterDemoMode, exitDemoMode,
            fetchApplications, fetchApplication, createApplication, updateApplication, deleteApplication,
            fetchCompanies, fetchCompany, createCompany, updateCompany, deleteCompany
        }}>
            {children}
        </DemoContext.Provider>
    );
}
