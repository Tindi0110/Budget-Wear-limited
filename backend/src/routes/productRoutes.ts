import { Router } from 'express';
import { getProducts, getProductById, searchProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticate, authorize } from '../lib/auth';

const router = Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', authenticate, authorize(['SUPERADMIN', 'BRANCH_ADMIN']), createProduct);
router.put('/:id', authenticate, authorize(['SUPERADMIN', 'BRANCH_ADMIN']), updateProduct);
router.delete('/:id', authenticate, authorize(['SUPERADMIN', 'BRANCH_ADMIN']), deleteProduct);

export default router;
