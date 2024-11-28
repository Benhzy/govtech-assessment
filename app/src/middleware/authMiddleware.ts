import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET: string = config.jwtSecret;

export interface AuthenticatedRequest extends Request {
    user?: {
        name: string;
        govEmail: string;
    };
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const token = req.cookies?.authToken;

    if (!token) {
        res.status(401).json({ error: 'Unauthorized access. Token missing.' });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, payload: any) => {
        if (err) {
            res.status(403).json({ error: 'Invalid or expired token.' });
            return;
        }

        if (!payload || typeof payload !== 'object') {
            res.status(403).json({ error: 'Invalid token payload.' });
            return;
        }

        const { name, email } = payload;

        if (!name || !email) {
            res.status(403).json({ error: 'Token payload validation error.' });
            return;
        }

        req.user = {
            name,
            govEmail: email,
        };

        next();
    });
}

export default authenticateToken;
