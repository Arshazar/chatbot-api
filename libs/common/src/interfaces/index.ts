// Authentication interfaces
export interface IAuthUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface ITokenPayload {
  sub: string; // User ID
  username: string;
  roles: string[];
  iat?: number; // Issued at
  exp?: number; // Expiration
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IAuthUser;
}

// User interfaces
export interface IUserProfile {
  userId: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  settings?: Record<string, any>;
}

export interface IUserStatus {
  userId: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: Date;
}

// Chat interfaces
export interface IConversation {
  id: string;
  type: 'private' | 'group';
  participants: string[]; // User IDs
  title?: string; // For group chats
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  sentAt: Date;
  deliveryStatus: 'sent' | 'delivered' | 'read';
  metadata?: Record<string, any>;
}

// Bot interfaces
export interface IBotCommand {
  name: string;
  description: string;
  usage: string;
  handler: string;
}

export interface IBot {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  commands: IBotCommand[];
}

export interface ICommandContext {
  userId: string;
  conversationId: string;
  messageId: string;
  args: string[];
  metadata?: Record<string, any>;
}
