// Service Names
export const SERVICE_NAMES = {
  API_GATEWAY: 'api-gateway',
  AUTH_SERVICE: 'auth-service',
  USER_SERVICE: 'user-service',
  CHAT_SERVICE: 'chat-service',
  BOT_SERVICE: 'bot-service',
} as const;

// Service Versions
export const SERVICE_VERSIONS = {
  V1: '1.0.0',
} as const;

// Service Status
export const SERVICE_STATUS = {
  HEALTHY: 'healthy',
  UNHEALTHY: 'unhealthy',
  STARTING: 'starting',
  STOPPING: 'stopping',
} as const;

// Message Types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system',
} as const;

// Conversation Types
export const CONVERSATION_TYPES = {
  DIRECT: 'direct',
  GROUP: 'group',
} as const;

// User Status
export const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
  BUSY: 'busy',
} as const;

// Error Codes
export const ERROR_CODES = {
  // Auth Errors (1000-1999)
  AUTH_INVALID_CREDENTIALS: 'AUTH_1001',
  AUTH_TOKEN_EXPIRED: 'AUTH_1002',
  AUTH_TOKEN_INVALID: 'AUTH_1003',
  AUTH_USER_NOT_FOUND: 'AUTH_1004',
  AUTH_EMAIL_EXISTS: 'AUTH_1005',
  AUTH_USERNAME_EXISTS: 'AUTH_1006',

  // User Errors (2000-2999)
  USER_NOT_FOUND: 'USER_2001',
  USER_PROFILE_NOT_FOUND: 'USER_2002',
  USER_INVALID_STATUS: 'USER_2003',

  // Chat Errors (3000-3999)
  CHAT_CONVERSATION_NOT_FOUND: 'CHAT_3001',
  CHAT_MESSAGE_NOT_FOUND: 'CHAT_3002',
  CHAT_INVALID_MESSAGE_TYPE: 'CHAT_3003',
  CHAT_INVALID_CONVERSATION_TYPE: 'CHAT_3004',

  // Bot Errors (4000-4999)
  BOT_COMMAND_NOT_FOUND: 'BOT_4001',
  BOT_INVALID_COMMAND: 'BOT_4002',
  BOT_INSUFFICIENT_PERMISSIONS: 'BOT_4003',

  // Service Registry Errors (5000-5999)
  SERVICE_NOT_FOUND: 'REG_5001',
  SERVICE_ALREADY_REGISTERED: 'REG_5002',
  SERVICE_HEARTBEAT_FAILED: 'REG_5003',

  // Common Errors (9000-9999)
  VALIDATION_ERROR: 'COM_9001',
  INTERNAL_SERVER_ERROR: 'COM_9002',
  SERVICE_UNAVAILABLE: 'COM_9003',
  RATE_LIMIT_EXCEEDED: 'COM_9004',
} as const;

// Pagination
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  USER_STATUS: (userId: string) => `user:status:${userId}`,
  CONVERSATION: (conversationId: string) =>
    `chat:conversation:${conversationId}`,
  SERVICE_INFO: (serviceId: string) => `service:info:${serviceId}`,
} as const;

// Cache TTL (in seconds)
export const CACHE_TTL = {
  USER_PROFILE: 3600, // 1 hour
  USER_STATUS: 300, // 5 minutes
  CONVERSATION: 1800, // 30 minutes
  SERVICE_INFO: 60, // 1 minute
} as const;

// Rate Limiting
export const RATE_LIMIT = {
  AUTH: {
    LOGIN: { points: 5, duration: 300 }, // 5 attempts per 5 minutes
    REGISTER: { points: 3, duration: 3600 }, // 3 attempts per hour
  },
  CHAT: {
    MESSAGE: { points: 60, duration: 60 }, // 60 messages per minute
  },
  API: {
    DEFAULT: { points: 100, duration: 60 }, // 100 requests per minute
  },
} as const;
