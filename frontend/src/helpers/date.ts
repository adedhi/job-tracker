import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(utc);
dayjs.extend(isoWeek);

export type TimeInterval = 'day' | 'week' | 'month';

export function parseStoredDate(isoString: string): Dayjs {
    return dayjs.utc(isoString);
}

export function formatDateForDisplay(isoString: string): string {
    return dayjs.utc(isoString).format("M/D/YYYY");
}

export function formatDateForGrouping(isoString: string, interval: TimeInterval = 'month'): string {
    const d = dayjs.utc(isoString);
    switch (interval) {
        case 'day':
            return d.format('YYYY-MM-DD');
        case 'week':
            return d.startOf('isoWeek').format('YYYY-MM-DD');
        case 'month':
            return d.format('YYYY-MM');
    }
}

export function formatDateForApi(date: Dayjs): string {
    return date.format("YYYY-MM-DD");
}
