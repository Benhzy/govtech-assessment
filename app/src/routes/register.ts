import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/authMiddleware';
import agencies from '../constants/agencies';

const router = express.Router();
const prisma = new PrismaClient();

// Extend Request to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    name: string;
    govEmail: string;
  };
}

// Fetch Registration Data
// GET /api/register/data
router.get('/data', (req: Request, res: Response): void => {
  res.json({ agencies });
});

// User Registration
// POST /api/register
router.post(
  '/',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { contactEmail, agency, jobDescription, termsAccepted } = req.body;

    // Check if termsAccepted is true
    if (!termsAccepted) {
      res.status(400).json({ error: 'Terms must be accepted.' });
      return;
    }

    if (!req.user) {
      res.status(403).json({ error: 'User information not found.' });
      return;
    }

    const { name, govEmail } = req.user;

    // Create user in database
    try {
      const user = await prisma.user.create({
        data: {
          name,
          govEmail,
          contactEmail,
          agency,
          jobDescription,
          termsAccepted,
        },
      });

      // Generate new JWT token with user ID
      const newToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
        expiresIn: '1h',
      });

      res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          contactEmail: user.contactEmail,
          agency: user.agency,
          jobDescription: user.jobDescription,
        },
        token: newToken,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Unique constraint failed
        res.status(400).json({ error: 'User already registered.' });
      } else {
        res.status(500).json({ error: 'An error occurred during registration.' });
      }
    }
  }
);

export default router;
