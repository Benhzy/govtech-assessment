import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const GOVAA_AUTH_URL = 'https://localhost/auth';

router.post('/govaa-authenticate', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
    }

    try {
        const response = await axios.post(GOVAA_AUTH_URL, { email, password });

        if (response.status === 200) {
            const { name } = response.data;
            const token = jwt.sign({ name, email }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ name, email, token });
        } else {
            res.status(401).json({ error: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(500).json({ error: 'Authentication failed.' });
    }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
    }

    try {
        const response = await axios.post(GOVAA_AUTH_URL, { email, password });

        if (response.status === 200) {
            const { name } = response.data;
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ name, email, token });
        } else {
            res.status(401).json({ error: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Login failed.' });
    }
});

export default router;
