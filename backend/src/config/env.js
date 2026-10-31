const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const isProd = (process.env.NODE_ENV || 'development') === 'production';

const config = {
  port: parseInt(process.env.PORT, 10) || (isProd ? 10000 : 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || (isProd
    ? 'mongodb+srv://<username>:<password>@cluster0.c4jhwfy.mongodb.net/devconnect'
    : 'mongodb://localhost:27017/devconnect'),
  jwtSecret: process.env.JWT_SECRET || 'devconnect_jwt_super_secret_key_2026_default',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  aiServiceUrl: process.env.AI_SERVICE_URL || (isProd
    ? 'https://devconnect-ai-service.onrender.com'
    : 'http://localhost:8001'),
  smtpHost: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  smtpPort: parseInt(process.env.SMTP_PORT, 10) || 587,
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  emailFrom: process.env.EMAIL_FROM || 'DevConnect <utkarshpal265@gmail.com>',
  frontendUrl: process.env.FRONTEND_URL || (isProd
    ? 'https://dev-connect-eight-psi.vercel.app'
    : 'http://localhost:5173')
};

module.exports = config;
