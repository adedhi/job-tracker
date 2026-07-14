import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth } from '../middleware/require-auth.js';
import { CreateCompanyPayload, UpdateCompanyPayload } from '@job-tracker/types';

const router = Router();
router.use(requireAuth); // All endpoints should require authentication

router.get("/", async (req: Request, res: Response) => {
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

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
        const company = await prisma.company.findFirst({
            where: { id: req.params.id, userId: req.userId! },
            include: { applications: true }
        });

        if (!company) {
            res.status(404).json({ error: "Company not found" });
        }

        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch company" });
    }
});

router.post("/", async (req: Request, res: Response) => {
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

router.patch("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
        const updates = req.body as UpdateCompanyPayload;
        const result = await prisma.company.updateMany({
            where: { id: req.params.id, userId: req.userId! },
            data: updates
        });

        if (result.count === 0) {
            return res.status(404).json({ error: "Company not found" });
        }

        const updated = await prisma.company.findUnique({
            where: { id: req.params.id }
        });

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update company" });
    }
});

router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
        const result = await prisma.company.deleteMany({
            where: { id: req.params.id, userId: req.userId! }
        });

        if (result.count === 0) {
            return res.status(404).json({ error: "Company not found" });
        }

        res.status(200).json({ message: "Company deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete company" });
    }
});

export default router;