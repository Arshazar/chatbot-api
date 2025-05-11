import { BaseResponse, ErrorResponse } from '../dto';
import { ERROR_CODES } from '../constants';

/**
 * Creates a success response with the provided data
 */
export function createSuccessResponse<T>(data: T): BaseResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Creates an error response with the provided error details
 */
export function createErrorResponse(
  code: keyof typeof ERROR_CODES,
  message: string,
  details?: unknown,
): ErrorResponse {
  return {
    code: ERROR_CODES[code],
    message,
    details,
  };
}

/**
 * Validates an email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a password strength
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function isStrongPassword(password: string): boolean {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Generates a random string of specified length
 */
export function generateRandomString(length: number): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Formats a date to ISO string with timezone
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Calculates pagination metadata
 */
export function calculatePagination(
  total: number,
  page: number,
  limit: number,
): {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
} {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    hasMore: page < totalPages,
  };
}

/**
 * Sanitizes an object by removing specified fields
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  fieldsToRemove: (keyof T)[],
): Partial<T> {
  const result = { ...obj };
  fieldsToRemove.forEach((field) => {
    delete result[field];
  });
  return result;
}

/**
 * Delays execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  initialDelay: number,
): Promise<T> {
  let retries = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (retries >= maxRetries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
      retries++;
    }
  }
}

/**
 * Validates a UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Truncates a string to specified length with ellipsis
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) {
    return str;
  }
  return str.slice(0, length) + '...';
}

/**
 * Deep merges two objects
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>,
): T {
  const result = { ...target };
  for (const key in source) {
    if (
      source[key] instanceof Object &&
      key in target &&
      target[key] instanceof Object
    ) {
      result[key] = deepMerge(
        target[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>,
      ) as T[Extract<keyof T, string>];
    } else {
      result[key] = source[key] as T[Extract<keyof T, string>];
    }
  }
  return result;
}
