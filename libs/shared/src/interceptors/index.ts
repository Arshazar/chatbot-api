import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { createSuccessResponse, createErrorResponse } from '../utils';
import { ERROR_CODES } from '../constants';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          this.logger.log(`${method} ${url} ${duration}ms`, {
            body,
            query,
            params,
            response: data,
          });
        },
        error: (error) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          this.logger.error(`${method} ${url} ${duration}ms`, {
            body,
            query,
            params,
            error: error.message,
            stack: error.stack,
          });
        },
      }),
    );
  }
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }
        return createSuccessResponse(data);
      }),
    );
  }
}

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        this.logger.error(error.message, error.stack);

        if (error.response) {
          return Promise.reject(error);
        }

        const errorResponse = createErrorResponse(
          'INTERNAL_SERVER_ERROR',
          error.message,
          error.stack,
        );

        return Promise.reject(errorResponse);
      }),
    );
  }
}

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, { data: any; timestamp: number }>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = this.getCacheKey(request);
    const cacheTTL = this.getCacheTTL(context);

    if (!cacheKey || !cacheTTL) {
      return next.handle();
    }

    const cached = this.cache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < cacheTTL * 1000) {
      return new Observable((subscriber) => {
        subscriber.next(cached.data);
        subscriber.complete();
      });
    }

    return next.handle().pipe(
      tap((data) => {
        this.cache.set(cacheKey, {
          data,
          timestamp: now,
        });
      }),
    );
  }

  private getCacheKey(request: any): string | null {
    const { method, url, body, query, params } = request;
    return `${method}:${url}:${JSON.stringify(body)}:${JSON.stringify(query)}:${JSON.stringify(params)}`;
  }

  private getCacheTTL(context: ExecutionContext): number | null {
    const handler = context.getHandler();
    const ttl = Reflect.getMetadata('cacheTTL', handler);
    return ttl || null;
  }
}

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly timeout: number = 5000) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap({
        error: (error) => {
          if (error.name === 'TimeoutError') {
            throw createErrorResponse(
              'SERVICE_UNAVAILABLE',
              'Request timeout',
              { timeout: this.timeout },
            );
          }
          throw error;
        },
      }),
    );
  }
}

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { body, query, params } = request;

    // Validate request data
    this.validateRequestData(body);
    this.validateRequestData(query);
    this.validateRequestData(params);

    return next.handle();
  }

  private validateRequestData(data: any): void {
    if (!data) {
      return;
    }

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === null) {
        throw createErrorResponse(
          'VALIDATION_ERROR',
          `Invalid value for ${key}`,
          { field: key },
        );
      }
    }
  }
}
