import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import challengeRoutes from './routes/challengeRoutes';
import payoutRoutes from './routes/payoutRoutes';
import propFirmRoutes from './routes/propFirmRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/propfirms', propFirmRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
