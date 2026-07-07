import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { CreateCompanyPayload } from '@job-tracker/types';

const router = Router();
const DUMMY_USER_ID = "dummy-user-123"; // Temporary until users are implemented

router.get("/", async (req: Request, res: Response) => {
    try {
        const companies = await prisma.company.findMany({
            where: { userId: DUMMY_USER_ID }, // Change this
            include: { applications: true }
        });

        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch companies" });
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const { name } = req.body as CreateCompanyPayload;
        const company = await prisma.company.create({
            data: {
                name,
                userId: DUMMY_USER_ID // Change this
            },
        });

        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({ error: "Failed to create company" });
    }
});

export default router;