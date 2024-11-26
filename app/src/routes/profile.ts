import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/authMiddleware';

const router = express.Router();
const prisma = new PrismaClient();

// Extend the Request type to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

// Get User Profile
// GET /api/profile
router.get(
  '/',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    // Check if user is authenticated
    if (!req.user || !req.user.userId) {
      res.status(403).json({ error: 'Unauthorized access.' });
      return;
    }

    const userId = req.user.userId;

    try {
      // Fetch user profile from the database
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }

      res.json({
        user: {
          id: user.id,
          name: user.name,
          contactEmail: user.contactEmail,
          agency: user.agency,
          jobDescription: user.jobDescription,
        },
      });
    } catch (error) {
      console.error('Error fetching user profile:', error); // Log the error for debugging
      res.status(500).json({ error: 'An error occurred while fetching the user profile.' });
    }
  }
);

export default router;
