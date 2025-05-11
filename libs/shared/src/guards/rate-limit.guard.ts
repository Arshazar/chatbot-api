import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RATE_LIMIT_KEY } from '../decorators';
import { RateLimitException } from '../exceptions';
import { Request } from 'express';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly store = new Map<
    string,
    { points: number; timestamp: number }
  >();

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rateLimitOptions = this.reflector.get<{
      points: number;
      duration: number;
    }>(RATE_LIMIT_KEY, context.getHandler());

    if (!rateLimitOptions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const key = this.getRateLimitKey(request);
    const now = Date.now();

    const current = this.store.get(key) || { points: 0, timestamp: now };
    const timePassed = now - current.timestamp;

    if (timePassed >= rateLimitOptions.duration * 1000) {
      // Reset if duration has passed
      current.points = 0;
      current.timestamp = now;
    }

    if (current.points >= rateLimitOptions.points) {
      throw new RateLimitException('Rate limit exceeded', {
        retryAfter: Math.ceil(
          (rateLimitOptions.duration * 1000 - timePassed) / 1000,
        ),
      });
    }

    current.points++;
    this.store.set(key, current);

    return true;
  }

  private getRateLimitKey(request: Request): string {
    const ip = request.ip;
    const path = request.path;
    const method = request.method;
    return `${ip}:${method}:${path}`;
  }
}
