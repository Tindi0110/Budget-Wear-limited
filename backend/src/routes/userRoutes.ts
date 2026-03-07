import { Router } from 'express';
import { register, login, getStaff } from '../controllers/userController';
import { authenticate, authorize } from '../lib/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/staff', authenticate, authorize(['SUPERADMIN', 'BRANCH_ADMIN']), getStaff);

export default router;
