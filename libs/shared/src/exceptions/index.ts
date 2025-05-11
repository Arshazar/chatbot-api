import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODES } from '../constants';

export class BaseException extends HttpException {
  constructor(
    code: keyof typeof ERROR_CODES,
    message: string,
    status: HttpStatus,
    details?: unknown,
  ) {
    super(
      {
        code: ERROR_CODES[code],
        message,
        details,
      },
      status,
    );
  }
}

export class ValidationException extends BaseException {
  constructor(message: string, details?: unknown) {
    super('VALIDATION_ERROR', message, HttpStatus.BAD_REQUEST, details);
  }
}

export class AuthenticationException extends BaseException {
  constructor(message: string, details?: unknown) {
    super(
      'AUTH_INVALID_CREDENTIALS',
      message,
      HttpStatus.UNAUTHORIZED,
      details,
    );
  }
}

export class AuthorizationException extends BaseException {
  constructor(message: string, details?: unknown) {
    super(
      'BOT_INSUFFICIENT_PERMISSIONS',
      message,
      HttpStatus.FORBIDDEN,
      details,
    );
  }
}

export class NotFoundException extends BaseException {
  constructor(message: string, details?: unknown) {
    super('USER_NOT_FOUND', message, HttpStatus.NOT_FOUND, details);
  }
}

export class ConflictException extends BaseException {
  constructor(message: string, details?: unknown) {
    super('AUTH_EMAIL_EXISTS', message, HttpStatus.CONFLICT, details);
  }
}

export class ServiceUnavailableException extends BaseException {
  constructor(message: string, details?: unknown) {
    super(
      'SERVICE_UNAVAILABLE',
      message,
      HttpStatus.SERVICE_UNAVAILABLE,
      details,
    );
  }
}

export class RateLimitException extends BaseException {
  constructor(message: string, details?: unknown) {
    super(
      'RATE_LIMIT_EXCEEDED',
      message,
      HttpStatus.TOO_MANY_REQUESTS,
      details,
    );
  }
}

export class InternalServerException extends BaseException {
  constructor(message: string, details?: unknown) {
    super(
      'INTERNAL_SERVER_ERROR',
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

export class ServiceRegistryException extends BaseException {
  constructor(message: string, details?: unknown) {
    super('SERVICE_NOT_FOUND', message, HttpStatus.BAD_GATEWAY, details);
  }
}

export class MessageBrokerException extends BaseException {
  constructor(message: string, details?: unknown) {
    super('SERVICE_UNAVAILABLE', message, HttpStatus.BAD_GATEWAY, details);
  }
}

export class DatabaseException extends BaseException {
  constructor(message: string, details?: unknown) {
    super(
      'INTERNAL_SERVER_ERROR',
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

export class CacheException extends BaseException {
  constructor(message: string, details?: unknown) {
    super(
      'SERVICE_UNAVAILABLE',
      message,
      HttpStatus.SERVICE_UNAVAILABLE,
      details,
    );
  }
}

export class FileStorageException extends BaseException {
  constructor(message: string, details?: unknown) {
    super(
      'INTERNAL_SERVER_ERROR',
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}

export class ExternalServiceException extends BaseException {
  constructor(message: string, details?: unknown) {
    super('SERVICE_UNAVAILABLE', message, HttpStatus.BAD_GATEWAY, details);
  }
}
