import { Transport } from '@nestjs/microservices';

export interface RabbitMQConfig {
  urls: string[];
  queue: string;
  queueOptions: {
    durable: boolean;
    arguments?: Record<string, any>;
  };
  exchange?: string;
  exchangeOptions?: {
    durable: boolean;
    type: 'direct' | 'topic' | 'fanout' | 'headers';
  };
  routingKey?: string;
  prefetchCount?: number;
  isGlobalPrefetchCount?: boolean;
}

export const RABBITMQ_EXCHANGES = {
  DIRECT: 'chatbot.direct',
  TOPIC: 'chatbot.topic',
  FANOUT: 'chatbot.fanout',
  DEAD_LETTER: 'chatbot.dead.letter',
} as const;

export const RABBITMQ_QUEUES = {
  AUTH: 'auth_queue',
  USER: 'user_queue',
  CHAT: 'chat_queue',
  BOT: 'bot_queue',
  SERVICE_REGISTRY: 'service_registry_queue',
  DEAD_LETTER: 'dead.letter.queue',
} as const;

export const RABBITMQ_ROUTING_KEYS = {
  AUTH: {
    REGISTER: 'auth.register',
    LOGIN: 'auth.login',
    VALIDATE_TOKEN: 'auth.validate_token',
    REFRESH_TOKEN: 'auth.refresh_token',
  },
  USER: {
    CREATE_PROFILE: 'user.create_profile',
    GET_PROFILE: 'user.get_profile',
    UPDATE_PROFILE: 'user.update_profile',
    SEARCH_USERS: 'user.search_users',
    SET_STATUS: 'user.set_status',
    GET_STATUS: 'user.get_status',
  },
  CHAT: {
    CREATE_CONVERSATION: 'chat.create_conversation',
    GET_CONVERSATION: 'chat.get_conversation',
    LIST_CONVERSATIONS: 'chat.list_conversations',
    SEND_MESSAGE: 'chat.send_message',
    GET_MESSAGES: 'chat.get_messages',
  },
  BOT: {
    PROCESS_COMMAND: 'bot.process_command',
    GET_BOT_INFO: 'bot.get_bot_info',
    LIST_COMMANDS: 'bot.list_commands',
  },
  SERVICE_REGISTRY: {
    REGISTER: 'service.register',
    UNREGISTER: 'service.unregister',
    HEARTBEAT: 'service.heartbeat',
    GET: 'service.get',
    GET_ALL: 'service.getAll',
  },
} as const;

export const getRabbitMQConfig = (queue: string): RabbitMQConfig => {
  const baseConfig: RabbitMQConfig = {
    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
    queue,
    queueOptions: {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': RABBITMQ_EXCHANGES.DEAD_LETTER,
        'x-dead-letter-routing-key': queue,
      },
    },
    exchange: RABBITMQ_EXCHANGES.DIRECT,
    exchangeOptions: {
      durable: true,
      type: 'direct',
    },
    prefetchCount: 1,
    isGlobalPrefetchCount: true,
  };

  // Add specific configurations for each queue
  switch (queue) {
    case RABBITMQ_QUEUES.AUTH:
      return {
        ...baseConfig,
        routingKey: RABBITMQ_ROUTING_KEYS.AUTH.REGISTER,
      };
    case RABBITMQ_QUEUES.USER:
      return {
        ...baseConfig,
        routingKey: RABBITMQ_ROUTING_KEYS.USER.CREATE_PROFILE,
      };
    case RABBITMQ_QUEUES.CHAT:
      return {
        ...baseConfig,
        exchange: RABBITMQ_EXCHANGES.TOPIC,
        exchangeOptions: {
          durable: true,
          type: 'topic',
        },
        routingKey: RABBITMQ_ROUTING_KEYS.CHAT.SEND_MESSAGE,
      };
    case RABBITMQ_QUEUES.BOT:
      return {
        ...baseConfig,
        exchange: RABBITMQ_EXCHANGES.FANOUT,
        exchangeOptions: {
          durable: true,
          type: 'fanout',
        },
      };
    case RABBITMQ_QUEUES.SERVICE_REGISTRY:
      return {
        ...baseConfig,
        routingKey: RABBITMQ_ROUTING_KEYS.SERVICE_REGISTRY.REGISTER,
      };
    case RABBITMQ_QUEUES.DEAD_LETTER:
      return {
        ...baseConfig,
        queueOptions: {
          ...baseConfig.queueOptions,
          arguments: undefined, // Remove dead letter configuration for the dead letter queue
        },
      };
    default:
      return baseConfig;
  }
};

export const getRabbitMQTransportConfig = (queue: string) => {
  const config = getRabbitMQConfig(queue);
  return {
    transport: Transport.RMQ,
    options: config,
  };
};
