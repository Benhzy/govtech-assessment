import { Router } from 'express';
import { authenticateUser, logoutUser } from '../controllers/authController';

const router = Router();

// auth endpoint
router.post('/', authenticateUser);

// logout endpoint
router.post('/logout', logoutUser);

export default router;
