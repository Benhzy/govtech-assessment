import express from 'express';
import { getRegisterData, registerUser } from '../controllers/registerController';
import authenticateToken from '../middleware/authMiddleware';

const router = express.Router();

// data endpoint
router.get('/data', authenticateToken, getRegisterData);

// register endpoint
router.post('/', authenticateToken, registerUser);

export default router;
