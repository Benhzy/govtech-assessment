import express from 'express';
import { getUserProfile } from '../controllers/profileController';
import authenticateToken from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getUserProfile);

export default router;
