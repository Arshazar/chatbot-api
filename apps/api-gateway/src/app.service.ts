import { Injectable, Logger } from '@nestjs/common';
import { ServiceDiscoveryService } from './service-discovery/service-discovery.service';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly serviceDiscovery: ServiceDiscoveryService) {}

  async getHello(): Promise<string> {
    try {
      const authClient = this.serviceDiscovery.getClient('AUTH_SERVICE');
      if (!authClient) {
        throw new Error('Auth service client not found');
      }

      const response = await firstValueFrom(
        (authClient as ClientProxy).send(
          { cmd: 'validate_token' },
          { token: 'test' },
        ),
      );
      return `Hello World! Auth service response: ${JSON.stringify(response)}`;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error calling auth service: ${errorMessage}`);
      return 'Hello World! (Auth service unavailable)';
    }
  }
}
