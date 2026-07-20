import { ApplicationResponse, ApplicationStatus, CompanyResponse } from '@job-tracker/types';

// Better than hardcoding the dates
function daysAgo(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
}

export function getSeedCompanies(): CompanyResponse[] {
    return [
        { id: "demo-company-1", name: "Northwind Analytics"},
        { id: "demo-company-2", name: "Alderbrook Systems"},
        { id: "demo-company-3", name: "Fenwick & Cole"},
        { id: "demo-company-4", name: "Cascade Robotics"},
        { id: "demo-company-5", name: "Harborview Digital"}
    ];
}

export function getSeedApplications(): ApplicationResponse[] {
    return [
        { id: "demo-app-1", roleTitle: "Frontend Engineer", status: "INTERVIEWING" as ApplicationStatus, jobUrl: null, salary: "$115,000", appliedDate: daysAgo(38), updatedAt: daysAgo(5), companyId: "demo-company-1" },
        { id: "demo-app-2", roleTitle: "Backend Engineer", status: "APPLIED" as ApplicationStatus, jobUrl: null, salary: null, appliedDate: daysAgo(33), updatedAt: daysAgo(33), companyId: "demo-company-2" },
        { id: "demo-app-3", roleTitle: "Full Stack Developer", status: "REJECTED" as ApplicationStatus, jobUrl: null, salary: "$105,000", appliedDate: daysAgo(29), updatedAt: daysAgo(20), companyId: "demo-company-3" },
        { id: "demo-app-4", roleTitle: "Software Engineer", status: "OFFER" as ApplicationStatus, jobUrl: null, salary: "$128,000", appliedDate: daysAgo(24), updatedAt: daysAgo(3), companyId: "demo-company-4" },
        { id: "demo-app-5", roleTitle: "Platform Engineer", status: "ACCEPTED" as ApplicationStatus, jobUrl: null, salary: "$132,000", appliedDate: daysAgo(19), updatedAt: daysAgo(1), companyId: "demo-company-5" },
        { id: "demo-app-6", roleTitle: "Junior Developer", status: "APPLIED" as ApplicationStatus, jobUrl: null, salary: null, appliedDate: daysAgo(14), updatedAt: daysAgo(14), companyId: "demo-company-1" },
        { id: "demo-app-7", roleTitle: "DevOps Engineer", status: "INTERVIEWING" as ApplicationStatus, jobUrl: null, salary: "$120,000", appliedDate: daysAgo(10), updatedAt: daysAgo(2), companyId: "demo-company-2" },
        { id: "demo-app-8", roleTitle: "Web Developer", status: "APPLIED" as ApplicationStatus, jobUrl: null, salary: null, appliedDate: daysAgo(4), updatedAt: daysAgo(4), companyId: null },
    ].map((a) => ({ ...a, company: getSeedCompanies().find((c) => c.id === a.companyId) ?? null }));
}
