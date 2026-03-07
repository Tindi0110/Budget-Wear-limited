import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { page = '1', limit = '12', search, category, branch, sort } = req.query;

        const pageNumber = parseInt(page as string);
        const limitNumber = parseInt(limit as string);
        const skip = (pageNumber - 1) * limitNumber;

        // Build where clause
        const where: any = {};
        if (search) {
            where.name = { contains: search as string, mode: 'insensitive' };
        }
        if (category) {
            where.category_id = category;
        }
        if (branch) {
            where.branch_id = branch;
        }

        // Build order by
        let orderBy: any = { created_at: 'desc' };
        if (sort === 'price_asc') orderBy = { price: 'asc' };
        if (sort === 'price_desc') orderBy = { price: 'desc' };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limitNumber,
                orderBy,
                include: {
                    branch: true,
                    category: true,
                    images: {
                        orderBy: { position: 'asc' }
                    }
                }
            }),
            prisma.product.count({ where })
        ]);

        res.json({
            results: products,
            page: pageNumber,
            limit: limitNumber,
            total
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const searchProducts = async (req: Request, res: Response) => {
    try {
        const { query, branch, limit = '5' } = req.query;
        if (!query) return res.json([]);

        const where: any = {
            name: { contains: query as string, mode: 'insensitive' }
        };
        if (branch) where.branch_id = branch;

        const products = await prisma.product.findMany({
            where,
            take: parseInt(limit as string),
            include: {
                images: { take: 1, orderBy: { position: 'asc' } },
                branch: { select: { name: true } }
            }
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                branch: true,
                category: true,
                images: { orderBy: { position: 'asc' } }
            }
        });

        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};
