import { ConfigModuleOptions } from '@nestjs/config';

// Configuration options for each service
export const getConfigOptions = (isGlobal = true): ConfigModuleOptions => ({
  isGlobal,
  envFilePath: ['.env.local', '.env'],
  expandVariables: true,
});

// Database configurations
export const getPostgresConfig = () => ({
  type: 'postgres' as const,
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  synchronize: process.env.NODE_ENV !== 'production',
});

export const getMongoConfig = () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/chatbot',
});

// Redis configuration
export const getRedisConfig = () => ({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// RabbitMQ configuration
export const getRabbitMQConfig = (queue: string) => ({
  urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
  queue,
  queueOptions: {
    durable: false,
  },
});

// JWT configuration
export const getJwtConfig = () => ({
  secret: process.env.JWT_SECRET || 'secret',
  signOptions: { expiresIn: '1h' },
});

// Socket.io configuration
export const getSocketConfig = () => ({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  },
  namespace: '/chat',
  adapter: {
    url: getRedisConfig().url,
  },
});
