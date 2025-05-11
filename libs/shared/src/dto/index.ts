export interface BaseResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> extends BaseResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Auth DTOs
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  username: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// User DTOs
export interface UserProfileDto {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileDto {
  displayName?: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

// Chat DTOs
export interface MessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationDto {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  participants: string[];
  lastMessage?: MessageDto;
  createdAt: Date;
  updatedAt: Date;
}

// Bot DTOs
export interface BotCommandDto {
  name: string;
  description: string;
  usage: string;
  examples: string[];
  permissions?: string[];
}

export interface BotResponseDto {
  type: 'text' | 'image' | 'file' | 'system';
  content: string;
  metadata?: Record<string, unknown>;
}

// Service Registry DTOs
export interface ServiceInfo {
  name: string;
  version: string;
  status: 'healthy' | 'unhealthy' | 'starting' | 'stopping';
  metadata?: Record<string, unknown>;
}

export interface ServiceRegistrationDto extends ServiceInfo {
  serviceId: string;
  lastSeen: Date;
}

// Error DTOs
export interface ErrorResponse {
  code: string;
  message: string;
  details?: unknown;
}

// Common DTOs
export interface PaginationDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchDto extends PaginationDto {
  query: string;
  filters?: Record<string, unknown>;
}
