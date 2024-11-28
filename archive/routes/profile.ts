import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/authMiddleware';

const router = express.Router();
const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    name: string;
    govEmail: string;
  };
}

router.get(
  '/',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    // Validate user
    if (!req.user || !req.user.govEmail) {
      res.status(403).json({ error: 'Unauthorized access. User information missing.' });
      return;
    }

    const { govEmail } = req.user;

    try {
      // Retrieve user by govEmail
      const user = await prisma.user.findUnique({
        where: {
          govEmail,
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
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Profile retrieval failed.' });
    }
  }
);

export default router;
