import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from './config/config'

import authRoutes from './routes/auth';
import registerRoutes from './routes/register';
import profileRoutes from './routes/profile';

const app = express();

app.use(bodyParser.json());
app.use(cors());

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
