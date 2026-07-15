export type User = {
    id: string;
    email: string;
};

export type UserInfoPayload = {
    email: string;
    password: string;
};

export type ApplicationStatus = "APPLIED" | "INTERVIEWING" | "REJECTED" | "OFFER" | "ACCEPTED";

export type CreateApplicationPayload = {
    roleTitle: string;
    status: ApplicationStatus;
    jobUrl?: string;
    salary?: string;
    companyId?: string;
};

export type ApplicationResponse = {
    id: string;
    roleTitle: string;
    status: ApplicationStatus;
    jobUrl: string | null;
    salary: string | null;
    appliedDate: string;
    updatedAt: string;
    companyId: string | null;
    company?: CompanyResponse | null;
};

export type UpdateApplicationPayload = Partial<CreateApplicationPayload>;

export type CompanyResponse = {
    id: string;
    name: string;
};

export type CompanyWithApplicationsResponse = CompanyResponse & {
    applications: ApplicationResponse[];
};

export type CreateCompanyPayload = {
    name: string;
};

export type UpdateCompanyPayload = CreateCompanyPayload; // If any new editable fields are added to Company, make this Partial<>
