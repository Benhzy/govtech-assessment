import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from './config/config';

import authRoutes from './routes/auth';
import registerRoutes from './routes/register';
import profileRoutes from './routes/profile';

const app = express();

// For deployment
import cors from 'cors';
app.use(cors());

// Parse cookie
app.use(express.json());
app.use(cookieParser()); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/profile', profileRoutes);

if (!config.port) {
  throw new Error("Port not found.");
}
const PORT: string = `${config.port}`;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
