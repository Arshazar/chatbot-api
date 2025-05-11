import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { RegistryService } from '../registry/registry.service';
import { ServiceInfo } from 'libs/shared/src/service-registry/service-registry.service';

@Injectable()
export class ServiceDiscoveryService implements OnModuleInit {
  private readonly logger = new Logger(ServiceDiscoveryService.name);
  private readonly clients = new Map<string, ClientProxy>();
  private readonly checkIntervalMs = 30000; // 30 seconds
  private interval: NodeJS.Timeout;

  constructor(private readonly registryService: RegistryService) {}

  async onModuleInit() {
    // Initial service discovery
    await this.discoverServices();

    // Start periodic service discovery
    this.interval = setInterval(() => {
      this.discoverServices().catch((error) => {
        this.logger.error(`Service discovery failed: ${error.message}`);
      });
    }, this.checkIntervalMs);
  }

  private async discoverServices() {
    const services = await this.registryService.getAllServices();

    for (const service of services) {
      if (!this.clients.has(service.name)) {
        await this.registerService(service);
      }
    }

    // Remove clients for services that are no longer registered
    for (const [serviceName, client] of this.clients.entries()) {
      const service = services.find((s) => s.name === serviceName);
      if (!service) {
        await client.close();
        this.clients.delete(serviceName);
        this.logger.log(`Removed client for service: ${serviceName}`);
      }
    }
  }

  private async registerService(service: ServiceInfo) {
    try {
      const client = ClientsModule.register([
        {
          name: service.name,
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
            queue: `${service.name.toLowerCase()}_queue`,
            queueOptions: {
              durable: false,
            },
          },
        },
      ])[0];

      await client.connect();
      this.clients.set(service.name, client);
      this.logger.log(`Registered client for service: ${service.name}`);
    } catch (error) {
      this.logger.error(
        `Failed to register client for service ${service.name}: ${error.message}`,
      );
    }
  }

  getClient(serviceName: string): ClientProxy | undefined {
    return this.clients.get(serviceName);
  }

  async onModuleDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    // Close all client connections
    for (const [serviceName, client] of this.clients.entries()) {
      try {
        await client.close();
        this.logger.log(`Closed connection for service: ${serviceName}`);
      } catch (error) {
        this.logger.error(
          `Failed to close connection for service ${serviceName}: ${error.message}`,
        );
      }
    }
  }
}
