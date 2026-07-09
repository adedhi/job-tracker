import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth } from '../middleware/require-auth.js';
import { CreateCompanyPayload } from '@job-tracker/types';

const router = Router();

router.get("/", requireAuth, async (req: Request, res: Response) => {
    try {
        const companies = await prisma.company.findMany({
            where: { userId: req.userId! },
            include: { applications: true }
        });

        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch companies" });
    }
});

router.post("/", requireAuth, async (req: Request, res: Response) => {
    try {
        const { name } = req.body as CreateCompanyPayload;
        const company = await prisma.company.create({
            data: {
                name,
                userId: req.userId!
            },
        });

        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({ error: "Failed to create company" });
    }
});

export default router;