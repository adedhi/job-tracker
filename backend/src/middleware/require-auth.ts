import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma.js';
import { logError } from '../helpers/logger.js';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const sessionId = req.cookies?.sessionId;
        if (!sessionId) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const session = await prisma.session.findUnique({ where: { id: sessionId } });
        if (!session || session.expiresAt < new Date()) {
            return res.status(401).json({ error: "Session expired" });
        }

        req.userId = session.userId;
        next();
    } catch (error) {
        logError("[require-auth]: requireAuth", error);
        res.status(500).json({ error: "Authentication check failed" });
    }
}