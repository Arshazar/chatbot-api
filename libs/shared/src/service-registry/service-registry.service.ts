import {
  Injectable,
  Inject,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ServiceRegistryModuleOptions } from './service-registry.module';
import { firstValueFrom } from 'rxjs';

export interface ServiceInfo {
  name: string;
  host: string;
  port: number;
  metadata?: Record<string, any>;
}

@Injectable()
export class ServiceRegistryService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ServiceRegistryService.name);
  private heartbeatInterval: NodeJS.Timeout;
  private serviceId: string;

  constructor(
    @Inject('SERVICE_REGISTRY_CLIENT') private readonly client: ClientProxy,
    @Inject('SERVICE_REGISTRY_OPTIONS')
    private readonly options: ServiceRegistryModuleOptions,
  ) {
    this.serviceId = `${this.options.serviceName}-${Date.now()}`;
  }

  async onModuleInit() {
    await this.client.connect();
    this.logger.log(`Connected to Service Registry`);

    // Register the service
    await this.register();

    // Start sending heartbeats
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat().catch((err) => {
        this.logger.error(`Failed to send heartbeat: ${err.message}`);
      });
    }, 15000); // Send heartbeat every 15 seconds
  }

  async onModuleDestroy() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Unregister the service
    await this.unregister();
    await this.client.close();
  }

  private async register() {
    try {
      const serviceInfo = this.getServiceInfo();
      await firstValueFrom(this.client.emit('service.register', serviceInfo));
      this.logger.log(
        `Service ${this.options.serviceName} registered with ID ${this.serviceId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to register service: ${error.message}`);
      throw error;
    }
  }

  private async unregister() {
    try {
      await firstValueFrom(
        this.client.emit('service.unregister', { serviceId: this.serviceId }),
      );
      this.logger.log(`Service ${this.options.serviceName} unregistered`);
    } catch (error) {
      this.logger.error(`Failed to unregister service: ${error.message}`);
    }
  }

  private async sendHeartbeat() {
    await firstValueFrom(
      this.client.emit('service.heartbeat', { serviceId: this.serviceId }),
    );
    this.logger.debug(`Heartbeat sent for service ${this.options.serviceName}`);
  }

  private getServiceInfo(): ServiceInfo {
    return {
      name: this.options.serviceName,
      host: process.env.HOST || 'localhost',
      port: parseInt(process.env.PORT || '3000'),
      metadata: {
        serviceId: this.serviceId,
        startTime: new Date().toISOString(),
      },
    };
  }

  /**
   * Get information about a specific service by name
   */
  async getService(serviceName: string): Promise<ServiceInfo> {
    try {
      return await firstValueFrom(
        this.client.send('service.get', { serviceName }),
      );
    } catch (error) {
      this.logger.error(
        `Failed to get service ${serviceName}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get information about all registered services
   */
  async getAllServices(): Promise<ServiceInfo[]> {
    try {
      return await firstValueFrom(this.client.send('service.getAll', {}));
    } catch (error) {
      this.logger.error(`Failed to get all services: ${error.message}`);
      throw error;
    }
  }
}
