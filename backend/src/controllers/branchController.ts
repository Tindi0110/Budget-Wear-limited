import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getBranches = async (req: Request, res: Response) => {
    try {
        const branches = await prisma.branch.findMany({
            orderBy: { created_at: 'desc' },
        });
        res.json(branches);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch branches' });
    }
};

export const createBranch = async (req: Request, res: Response) => {
    try {
        const { name, location, type } = req.body;
        const branch = await prisma.branch.create({
            data: { name, location, type },
        });
        res.status(201).json(branch);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create branch' });
    }
};
