import jwt from 'jsonwebtoken';
import { config } from '../config/config';

const JWT_SECRET: string = config.jwtSecret;

function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // bearer token

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  jwt.verify(token, JWT_SECRET, (err: Error | null, payload: any) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }

    if (!payload || typeof payload !== 'object') {
      return res.status(403).json({ error: 'Invalid token payload format.' });
    }

    const { name, email } = payload;

    if (!name || !email) {
      return res.status(403).json({ error: 'Token payload validation error.' });
    }

    req.user = {
      name,
      govEmail: email,
    };

    next();
  });
}

export default authenticateToken;
