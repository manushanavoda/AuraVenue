import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import seatRoutes from './routes/seats';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes setup
app.use('/api', seatRoutes);

// Health check endpoint (Server එක වැඩද බලන්න)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'AuraVenue Backend Service Running OK' });
});

app.listen(PORT, () => {
  console.log(`🚀 AuraVenue Backend Server running on http://localhost:${PORT}`);
});