import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController';

const router = Router();

router.get('/:userId', getWishlist);
router.post('/', addToWishlist);
router.delete('/:id', removeFromWishlist);

export default router;
