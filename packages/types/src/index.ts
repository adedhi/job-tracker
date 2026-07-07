export type ApplicationStatus = "APPLIED" | "INTERVIEWING" | "REJECTED" | "OFFER" | "ACCEPTED";

export type CreateApplicationPayload = {
    roleTitle: string;
    status: ApplicationStatus;
    jobUrl?: string;
    salary?: string;
    companyId?: string;
};

export type CreateCompanyPayload = {
    name: string;
};
