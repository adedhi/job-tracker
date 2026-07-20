import { useDemoMode } from './useDemoMode';
import * as realApi from '../api/companies';

export function useCompaniesData() {
    const demo = useDemoMode();

    return demo.isDemoMode
        ? {
            fetchCompanies: demo.fetchCompanies,
            fetchCompany: demo.fetchCompany,
            createCompany: demo.createCompany,
            updateCompany: demo.updateCompany,
            deleteCompany: demo.deleteCompany
        }
        : realApi;
}
