import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { AppError } from './utils/AppError.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration (Render to Vercel and local dev)
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'https://worknear.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev/MVP to prevent CORS friction
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Request parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Root endpoint for Render and direct uptime checks
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'PocketPay Backend',
    message: 'Backend service is running',
    health: '/health',
    api: '/api/v1'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'PocketPay Backend'
  });
});

// Quiet favicon endpoint to prevent noisy 404s on browser probes
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Mount API v1
app.use('/api/v1', apiRoutes);

// 404 Handler
app.use('*', (req, res, next) => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl} - Endpoint not found`, 404, 'NOT_FOUND'));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
