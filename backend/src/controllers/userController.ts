import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name, role, branch_id } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'CUSTOMER',
                branch_id
            },
            select: { id: true, email: true, name: true, role: true, branch_id: true }
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, branch_id: user.branch_id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                branch_id: user.branch_id
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

export const getStaff = async (req: Request, res: Response) => {
    try {
        const { branch_id } = req.query;
        const where: any = {
            role: { in: ['BRANCH_ADMIN', 'BRANCH_STAFF'] }
        };
        if (branch_id) where.branch_id = branch_id as string;

        const staff = await prisma.user.findMany({
            where,
            select: { id: true, email: true, name: true, role: true, branch_id: true, branch: true }
        });

        res.json(staff);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch staff' });
    }
};
