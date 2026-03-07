import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getWishlist = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const wishlist = await prisma.wishlist.findMany({
            where: { user_id: userId },
            include: {
                product: {
                    include: {
                        images: { take: 1, orderBy: { position: 'asc' } },
                        branch: { select: { name: true } }
                    }
                }
            }
        });
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
};

export const addToWishlist = async (req: Request, res: Response) => {
    try {
        const { userId, productId } = req.body;
        
        // Check if already in wishlist
        const existing = await prisma.wishlist.findFirst({
            where: { user_id: userId, product_id: productId }
        });
        if (existing) return res.status(400).json({ error: 'Already in wishlist' });

        const wishlistItem = await prisma.wishlist.create({
            data: { user_id: userId, product_id: productId }
        });
        res.status(201).json(wishlistItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.wishlist.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
};
