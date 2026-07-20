import { createContext, ReactNode, useCallback, useRef, useState } from 'react';
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
    const applications = useRef<ApplicationResponse[]>([]);
    const companies = useRef<CompanyResponse[]>([]);

    const enterDemoMode = useCallback(() => {
        companies.current = getSeedCompanies();
        applications.current = getSeedApplications();
        setIsDemoMode(true);
    }, []);

    const exitDemoMode = useCallback(() => {
        setIsDemoMode(false);
        companies.current = [];
        applications.current = [];
    }, []);

    function attachCompany(app: ApplicationResponse, companyList: CompanyResponse[]): ApplicationResponse {
        return { ...app, company: companyList.find((company) => company.id === app.companyId) ?? null };
    }

    function withApplications(company: CompanyResponse, appList: ApplicationResponse[]): CompanyWithApplicationsResponse {
        return { ...company, applications: appList.filter((app) => app.companyId === company.id) };
    }

    function assertUniqueName(name: string, excludeId?: string) {
        const existingCompany = companies.current.some(
            (company) => company.id !== excludeId && company.name.trim().toLowerCase() === name.trim().toLowerCase()
        );
        if (existingCompany) throw new Error("You already have a company with this name");
    }

    const fetchApplications = useCallback(async () => applications.current, []);

    const fetchApplication = useCallback(async (id: string) => {
        const application = applications.current.find((app) => app.id === id);
        if (!application) throw new Error("Application not found");
        return application
    }, []);

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
        const withCompany = attachCompany(newApp, companies.current);
        applications.current = [...applications.current, withCompany];
        return withCompany;
    }, []);

    const updateApplication = useCallback(async (id: string, payload: UpdateApplicationPayload) => {
        const index = applications.current.findIndex((app) => app.id === id);
        if (index === -1) throw new Error("Application not found");

        const updated = attachCompany(
            {...applications.current[index], ...payload, updatedAt: new Date().toISOString()},
            companies.current
        );
        applications.current = applications.current.map((app, i) => i === index ? updated : app);
        return updated;
    }, []);

    const deleteApplication = useCallback(async (id: string) => {
        applications.current = applications.current.filter((app) => app.id !== id);
        return { message: "Application deleted" };
    }, []);

    const fetchCompanies = useCallback(async () =>
        companies.current.map((company) => withApplications(company, applications.current)),
    []);

    const fetchCompany = useCallback(async (id: string) => {
        const company = companies.current.find((company) => company.id === id);
        if (!company) throw new Error("Company not found");
        return withApplications(company, applications.current);
    }, []);

    const createCompany = useCallback(async (payload: CreateCompanyPayload) => {
        assertUniqueName(payload.name);
        const newCompany: CompanyResponse = {
            id: crypto.randomUUID(),
            name: payload.name.trim()
        };
        companies.current = [...companies.current, newCompany];
        return newCompany;
    }, []);

    const updateCompany = useCallback(async (id: string, payload: UpdateCompanyPayload) => {
        if (payload.name !== undefined) assertUniqueName(payload.name, id);

        const index = companies.current.findIndex((company) => company.id === id);
        if (index === -1) throw new Error("Company not found");

        const updated = { ...companies.current[index], ...payload };
        companies.current = companies.current.map((company, i) => i === index ? updated : company);
        return updated;
    }, []);

    const deleteCompany = useCallback(async (id: string) => {
        companies.current = companies.current.filter((company) => company.id !== id);
        applications.current = applications.current.map((app) => (app.companyId === id ? { ...app, companyId: null, company: null } : app));
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
