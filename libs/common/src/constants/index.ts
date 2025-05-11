// Service names
export const AUTH_SERVICE = 'AUTH_SERVICE';
export const USER_SERVICE = 'USER_SERVICE';
export const CHAT_SERVICE = 'CHAT_SERVICE';
export const BOT_SERVICE = 'BOT_SERVICE';

// Message patterns
export const MESSAGE_PATTERNS = {
  AUTH: {
    REGISTER: { cmd: 'register' },
    LOGIN: { cmd: 'login' },
    VALIDATE_TOKEN: { cmd: 'validate_token' },
    REFRESH_TOKEN: { cmd: 'refresh_token' },
  },
  USER: {
    CREATE_PROFILE: { cmd: 'create_profile' },
    GET_PROFILE: { cmd: 'get_profile' },
    UPDATE_PROFILE: { cmd: 'update_profile' },
    SEARCH_USERS: { cmd: 'search_users' },
    SET_STATUS: { cmd: 'set_status' },
    GET_STATUS: { cmd: 'get_status' },
  },
  CHAT: {
    CREATE_CONVERSATION: { cmd: 'create_conversation' },
    GET_CONVERSATION: { cmd: 'get_conversation' },
    LIST_CONVERSATIONS: { cmd: 'list_conversations' },
    SEND_MESSAGE: { cmd: 'send_message' },
    GET_MESSAGES: { cmd: 'get_messages' },
  },
  BOT: {
    PROCESS_COMMAND: { cmd: 'process_command' },
    GET_BOT_INFO: { cmd: 'get_bot_info' },
    LIST_COMMANDS: { cmd: 'list_commands' },
  },
};
