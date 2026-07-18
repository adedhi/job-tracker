import cron from 'node-cron';
import { prisma } from '../prisma.js';
import { logError } from './logger.js';

export function startSessionCleanup() {
    cron.schedule("0 3 * * *", async () => {
        try {
            const result = await prisma.session.deleteMany({
                where: { expiresAt: { lt: new Date() } }
            });
            console.log(`[session-cleanup] Removed ${result.count} expired session(s)`);
        } catch (error) {
            logError("session-cleanup", error);
        }
    });
}
