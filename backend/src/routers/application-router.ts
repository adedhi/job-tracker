import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { CreateApplicationPayload } from '@job-tracker/types';

const router = Router();
const DUMMY_USER_ID = "dummy-user-123"; // Temporary until users are implemented

router.get("/", async (req: Request, res: Response) => {
    try {
        const applications = await prisma.application.findMany({
            where: { userId: DUMMY_USER_ID }, // Change this
            include: { company: true }
        });

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch applications" });
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const { roleTitle, jobUrl, status, salary, companyId } = req.body as CreateApplicationPayload;
        const application = await prisma.application.create({
            data: {
                roleTitle,
                status,
                jobUrl: jobUrl || null,
                salary: salary || null,
                companyId: companyId || null,
                userId: DUMMY_USER_ID // Change this
            },
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ error: "Failed to create application" });
    }
});

export default router;