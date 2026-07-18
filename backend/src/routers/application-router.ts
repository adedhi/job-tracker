import { Router, Request, Response } from 'express';
import { CreateApplicationPayload, UpdateApplicationPayload } from '@job-tracker/types';
import { prisma } from '../prisma.js';
import { requireAuth } from '../middleware/require-auth.js';
import { logError } from '../helpers/logger.js';

const router = Router();
router.use(requireAuth); // All endpoints should require authentication

router.get("/", async (req: Request, res: Response) => {
    try {
        const applications = await prisma.application.findMany({
            where: { userId: req.userId! },
            include: { company: true }
        });

        res.status(200).json(applications);
    } catch (error) {
        logError("[application-router]: GET /", error);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
        const application = await prisma.application.findFirst({
            where: { id: req.params.id, userId: req.userId! },
            include: { company: true }
        });

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.status(200).json(application);
    } catch (error) {
        logError("[application-router]: GET /:id", error);
        res.status(500).json({ error: "Failed to fetch application" });
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
                userId: req.userId!
            },
        });

        res.status(201).json(application);
    } catch (error) {
        logError("[application-router]: POST /", error);
        res.status(500).json({ error: "Failed to create application" });
    }
});

router.patch("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
        const updates = req.body as UpdateApplicationPayload;
        const result = await prisma.application.updateMany({
            where: { id: req.params.id, userId: req.userId! },
            data: updates
        });

        if (result.count === 0) {
            return res.status(404).json({ error: "Application not found" });
        }

        const updated = await prisma.application.findUnique({
            where: { id: req.params.id },
            include: { company: true }
        });

        res.status(200).json(updated);
    } catch (error) {
        logError("[application-router]: PATCH /:id", error);
        res.status(500).json({ error: "Failed to update application" });
    }
});

router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
        const result = await prisma.application.deleteMany({
            where: { id: req.params.id, userId: req.userId! }
        });

        if (result.count === 0) {
            return res.status(404).json({ error: "Application not found" });
        }
        res.status(200).json({ message: "Application deleted" });
    } catch (error) {
        logError("[application-router]: DELETE /:id", error);
        res.status(500).json({ error: "Failed to delete application" });
    }
});

export default router;