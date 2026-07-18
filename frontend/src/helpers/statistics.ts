import { ApplicationResponse, ApplicationStatus } from '@job-tracker/types';

export type StatusCount = {
    status: ApplicationStatus;
    count: number
};

export type MonthlyCount = {
    label: string;
    count: number;
};

export type CompanyCount = {
    name: string;
    count: number;
};

const STATUS_ORDER: ApplicationStatus[] = ["APPLIED", "INTERVIEWING", "OFFER", "ACCEPTED", "REJECTED"];

export function computeStatusCounts(applications: ApplicationResponse[]): StatusCount[] {
    const counts = new Map<ApplicationStatus, number>(STATUS_ORDER.map((status) => [status, 0]));
    applications.forEach((app) => counts.set(app.status, (counts.get(app.status) ?? 0) + 1));
    return STATUS_ORDER.map((status) => ({ status, count: counts.get(status) ?? 0 }));
}

export function computeResponseRate(applications: ApplicationResponse[]): number {
    if (applications.length === 0) return 0;
    const responded = applications.filter((app) => app.status !== "APPLIED").length;
    return Math.round((responded / applications.length) * 100);
}

export function computeActiveCount(applications: ApplicationResponse[]): number {
    return applications.filter((app) => app.status === "APPLIED" || app.status === "INTERVIEWING").length;
}

export function computeApplicationsOverTime(applications: ApplicationResponse[]): MonthlyCount[] {
    const counts = new Map<string, number>();

    applications.forEach((app) => {
        const date = new Date(app.appliedDate);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    return [...counts.keys()].sort().map((key) => {
        const [year, month] = key.split("-");
        const label = new Date(Number(year), Number(month) - 1).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short"
        });
        return { label, count: counts.get(key)! };
    });
}

export function computeTopCompanies(applications: ApplicationResponse[], limit = 5): CompanyCount[] {
    const counts = new Map<string, number>();

    applications.forEach((app) => {
        if (!app.company) return;
        counts.set(app.company.name, (counts.get(app.company.name) ?? 0) + 1);
    });

    return [...counts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
}
