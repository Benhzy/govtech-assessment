import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    name: string;
    govEmail: string;
  };
}

export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user || !req.user.govEmail) {
    res.status(403).json({ error: 'Unauthorized access. Missing user details.' });
    return;
  }

  const { govEmail } = req.user;

  try {
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
};
