import { Response } from 'express';
import { AuthRequest } from '../lib/auth';
import prisma from '../lib/prisma';

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { items, branch_id } = req.body;
        const userId = req.user?.id;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order must have at least one item' });
        }

        // Transactions to ensure consistency
        const order = await prisma.$transaction(async (tx) => {
            let total = 0;
            const orderItemsData = [];

            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.product_id }
                });

                if (!product) throw new Error(`Product ${item.product_id} not found`);
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product ${product.name}`);
                }

                // Deduct stock
                await tx.product.update({
                    where: { id: product.id },
                    data: { stock: { decrement: item.quantity } }
                });

                total += product.price * item.quantity;
                orderItemsData.push({
                    product_id: product.id,
                    quantity: item.quantity,
                    price: product.price
                });
            }

            return tx.order.create({
                data: {
                    user_id: userId,
                    branch_id: branch_id,
                    total,
                    status: 'PENDING',
                    items: {
                        create: orderItemsData
                    }
                },
                include: { items: true }
            });
        });

        res.status(201).json(order);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Order creation failed' });
    }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;
        const branchId = req.user?.branch_id;

        const where: any = {};
        if (role === 'CUSTOMER') {
            where.user_id = userId;
        } else if (role === 'BRANCH_ADMIN' || role === 'BRANCH_STAFF') {
            where.branch_id = branchId;
        }
        // SUPERADMIN sees all

        const orders = await prisma.order.findMany({
            where,
            include: {
                items: { include: { product: true } },
                branch: true,
                user: { select: { name: true, email: true } }
            },
            orderBy: { created_at: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await prisma.order.update({
            where: { id: id as string },
            data: { status }
        });

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
};
