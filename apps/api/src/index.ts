import dotenv from 'dotenv';
import path from 'path';
import { startServer } from './app';

// Load environment variables - try multiple locations
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config(); // fallback to default .env in current directory

// Set default environment variables if not found
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
  console.log('⚠️  Setting default DATABASE_URL: file:./dev.db');
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET =
    'your-super-secret-jwt-key-change-this-in-production';
  console.log('⚠️  Setting default JWT_SECRET');
}

if (!process.env.PORT) {
  process.env.PORT = '3000';
  console.log('⚠️  Setting default PORT: 3000');
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
  console.log('⚠️  Setting default NODE_ENV: development');
}

if (!process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL = 'http://localhost:5173';
  console.log('⚠️  Setting default FRONTEND_URL: http://localhost:5173');
}

// Debug: Log environment variables
console.log('🔍 Environment check:');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'NOT SET');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();
