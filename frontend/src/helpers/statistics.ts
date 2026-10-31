import dayjs from 'dayjs';
import { ApplicationResponse, ApplicationStatus } from '@job-tracker/types';
import { formatDateForGrouping, TimeInterval } from './date';

export type StatusCount = {
    status: ApplicationStatus;
    count: number
};

export type TimeBucketCount = {
    label: string;
    count: number;
    tooltipLabel: string;
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

/**
 * Generates every key between the first and last sorted keys, stepping by the
 * given interval, so that time periods with zero applications still appear.
 */
function fillTimeRange(sortedKeys: string[], interval: TimeInterval): string[] {
    if (sortedKeys.length <= 1) return sortedKeys;

    const parseKey = (key: string) => dayjs.utc(interval === 'month' ? `${key}-01` : key); // Add a -01 to the YYYY-MM month keys
    const formatKey = (d: dayjs.Dayjs) => interval === 'month' ? d.format('YYYY-MM') : d.format('YYYY-MM-DD');

    const allKeys: string[] = [];
    const end = parseKey(sortedKeys[sortedKeys.length - 1]);
    let date = parseKey(sortedKeys[0]);

    while (date.isBefore(end) || date.isSame(end, 'day')) {
        allKeys.push(formatKey(date));
        date = date.add(1, interval);
    }

    return allKeys;
}

export function computeApplicationsOverTime(
    applications: ApplicationResponse[],
    interval: TimeInterval = 'month'
): TimeBucketCount[] {
    if (applications.length === 0) return [];

    const counts = new Map<string, number>();
    applications.forEach((app) => {
        const key = formatDateForGrouping(app.appliedDate, interval);
        counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    const sortedKeys = [...counts.keys()].sort();
    const allKeys = fillTimeRange(sortedKeys, interval);

    return allKeys.map((key) => {
        let label: string;
        switch (interval) {
            case 'day':
            case 'week': {
                const [year, month, day] = key.split("-").map(Number);
                label = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC"
                });
                break;
            }
            case 'month': {
                const [year, month] = key.split("-").map(Number);
                label = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    timeZone: "UTC"
                });
                break;
            }
        }

        const year = key.slice(0, 4);
        const tooltipLabel =
            interval === 'week' ? `Week of ${label}, ${year}` :
            interval === 'day'  ? `${label}, ${year}` :
            label;

        return { label, count: counts.get(key) ?? 0, tooltipLabel };
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
