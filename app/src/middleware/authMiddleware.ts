import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware for JWT authentication
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.status(401).json({ error: 'Unauthorized access.' });

  jwt.verify(token, JWT_SECRET, (err: any, payload: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = payload;
    next();
  });
}

export default authenticateToken;
