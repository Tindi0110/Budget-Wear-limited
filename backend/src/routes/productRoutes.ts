import { Router } from 'express';
import { getProducts, getProductById, searchProducts } from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Admin routes can be added here
// router.post('/', createProduct);
// router.put('/:id', updateProduct);
// router.delete('/:id', deleteProduct);

export default router;
