import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController';
import { authenticate, authorize } from '../lib/auth';

const router = Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getOrders);
router.patch('/:id/status', authenticate, authorize(['SUPERADMIN', 'BRANCH_ADMIN', 'BRANCH_STAFF']), updateOrderStatus);

export default router;
