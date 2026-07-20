import { useDemoMode } from './useDemoMode';
import * as realApi from '../api/applications';

export function useApplicationsData() {
    const demo = useDemoMode();

    return demo.isDemoMode
        ? {
            fetchApplications: demo.fetchApplications,
            fetchApplication: demo.fetchApplication,
            createApplication: demo.createApplication,
            updateApplication: demo.updateApplication,
            deleteApplication: demo.deleteApplication
        }
        : realApi;
}
