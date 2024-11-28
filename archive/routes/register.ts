import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/authMiddleware';
import agencies from '../constants/agencies';

const router = express.Router();
const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    name: string;
    govEmail: string;
  };
}

router.get('/data', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(403).json({ error: 'User information not found.' });
    return;
  }

  const { name, govEmail } = req.user;

  res.json({
    agencies,
    user: {
      name,
      govEmail,
    },
  });
});

router.post(
  '/',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { contactEmail, agency, jobDescription, termsAccepted } = req.body;

    if (!termsAccepted) {
      res.status(400).json({ error: 'Terms must be accepted.' });
      return;
    }

    if (!req.user) {
      res.status(403).json({ error: 'User information not found.' });
      return;
    }

    const { name, govEmail } = req.user;

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

      res.status(201).json({
        user: {
          id: user.id,
          contactEmail: user.contactEmail,
          agency: user.agency,
          jobDescription: user.jobDescription,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {   // for constraint violation
        res.status(400).json({ error: 'User has already registered.' });
      } else {
        res.status(500).json({ error: 'An error occurred during registration.' });
      }
    }
  }
);

export default router;
