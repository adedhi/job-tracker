import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function parseStoredDate(isoString: string): Dayjs {
    return dayjs.utc(isoString);
}

export function formatDateForDisplay(isoString: string): string {
    return dayjs.utc(isoString).format("M/D/YYYY");
}

export function formatDateForGrouping(isoString: string): string {
    return dayjs.utc(isoString).format("YYYY-MM");
}

export function formatDateForApi(date: Dayjs): string {
    return date.format("YYYY-MM-DD");
}
