import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './modules/auth/auth.route';
import userRoutes from './modules/user/user.routes';
import driverRoutes from './modules/driver/driver.routes';
import rideRoutes from './modules/ride/ride.routes';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

connectDB().then(() => {
  logger.info('Database connected successfully');
}).catch((err) => {
  logger.error('MongoDB connection error:', err);
  process.exit(1); // Exit if connection fails
});

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/drivers', driverRoutes);
app.use('/rides', rideRoutes);

// Error Handler
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Ride Booking API is running 🚀');
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;