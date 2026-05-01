import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import srsRoutes from './routes/srs';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Eigo Master API' });
});

import { authenticateToken } from './middleware/auth';

// Mount modular routes here

import lessonRoutes from './routes/lessons';

app.use('/auth', authRoutes);
app.use('/srs', authenticateToken, srsRoutes);
app.use('/ai', authenticateToken, aiRoutes);
app.use('/lessons', authenticateToken, lessonRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
