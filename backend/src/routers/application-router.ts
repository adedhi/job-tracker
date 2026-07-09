import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth } from '../middleware/require-auth.js';
import { CreateApplicationPayload } from '@job-tracker/types';

const router = Router();

router.get("/", requireAuth, async (req: Request, res: Response) => {
    try {
        const applications = await prisma.application.findMany({
            where: { userId: req.userId! },
            include: { company: true }
        });

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch applications" });
    }
});

router.post("/", requireAuth, async (req: Request, res: Response) => {
    try {
        const { roleTitle, jobUrl, status, salary, companyId } = req.body as CreateApplicationPayload;
        const application = await prisma.application.create({
            data: {
                roleTitle,
                status,
                jobUrl: jobUrl || null,
                salary: salary || null,
                companyId: companyId || null,
                userId: req.userId!
            },
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ error: "Failed to create application" });
    }
});

export default router;