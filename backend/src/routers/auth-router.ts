import { Router, Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { UserInfoPayload } from '@job-tracker/types';
import { prisma } from '../prisma.js';
import { requireAuth } from '../middleware/require-auth.js';
import { authRateLimiter } from '../middleware/rate-limit.js';
import { sendVerificationEmail } from '../email/send-verification-email.js';
import { logError } from '../helpers/logger.js';

const router = Router();
const emailSchema = z.email();
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const EMAIL_VERIFICATION_DURATION_MS = 1000 * 60 * 60 * 24; // 1 day

function setSessionCookie(res: Response, sessionId: string) {
    res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: SESSION_DURATION_MS
    });
}

router.get("/me", requireAuth, async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: { id: req.userId! },
        select: { id: true, email: true }
    });
    res.status(200).json(user);
});

router.get("/verify-email", authRateLimiter, async (req: Request, res: Response) => {
    try {
        const { token } = req.query;
        if (typeof token !== "string") {
            return res.status(400).json({ error: "Missing token" });
        }

        const record = await prisma.verificationToken.findUnique({ where: { id: token } });
        if (!record || record.expiresAt < new Date()) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        await prisma.user.update({
            where: { id: record.userId },
            data: { emailVerified: true }
        });
        await prisma.verificationToken.delete({ where: { id: record.id } });

        res.status(200).json({ message: "Email verified" });
    } catch (error) {
        logError("[auth-router]: GET /verify-email", error);
        res.status(500).json({ error: "Failed to verify email" });
    }
});

router.post("/register", authRateLimiter, async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as UserInfoPayload;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const emailResult = emailSchema.safeParse(email);
        if (!emailResult.success) {
            return res.status(400).json({ error: "Please enter a valid email address" });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: "Email already in use" });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { email, passwordHash }
        });

        const session = await prisma.session.create({
            data: {
                userId: user.id,
                expiresAt: new Date(Date.now() + SESSION_DURATION_MS)
            }
        });

        const verificationToken = await prisma.verificationToken.create({
            data: {
                userId: user.id,
                expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_DURATION_MS)
            }
        });

        setSessionCookie(res, session.id);
        await sendVerificationEmail(user.email, verificationToken.id);
        res.status(201).json({ id: user.id, email: user.email });
    } catch (error) {
        logError("[auth-router]: POST /register", error);
        res.status(500).json({ error: "Failed to register" });
    }
});

router.post("/login", authRateLimiter, async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as UserInfoPayload;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" }); // Generic message to avoid divulging unnecessary information
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid email or password" }); // Generic message to avoid divulging unnecessary information
        }

        const session = await prisma.session.create({
            data: {
                userId: user.id,
                expiresAt: new Date(Date.now() + SESSION_DURATION_MS)
            }
        });

        setSessionCookie(res, session.id);
        res.status(200).json({ id: user.id, email: user.email });
    } catch (error) {
        logError("[auth-router]: POST /login", error);
        res.status(500).json({ error: "Failed to log in" });
    }
});

router.post("/logout", async (req: Request, res: Response) => {
    try {
        const sessionId = req.cookies?.sessionId;
        if (sessionId) {
            await prisma.session.deleteMany({ where: { id: sessionId } }); // deleteMany instead of delete to avoid throwing errors when no sessions
        }
        res.clearCookie("sessionId");
        res.status(200).json({ message: "Logged out" });
    } catch (error) {
        logError("[auth-router]: POST /logout", error);
        res.status(500).json({ error: "Failed to log out" });
    }
});

export default router;