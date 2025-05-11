import { Module, DynamicModule } from '@nestjs/common';
import { ServiceRegistryService } from './service-registry.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

export interface ServiceRegistryModuleOptions {
  serviceName: string;
  rabbitMqUrl?: string;
}

@Module({})
export class ServiceRegistryModule {
  static register(options: ServiceRegistryModuleOptions): DynamicModule {
    const { serviceName, rabbitMqUrl = 'amqp://localhost:5672' } = options;

    return {
      module: ServiceRegistryModule,
      imports: [
        ClientsModule.register([
          {
            name: 'SERVICE_REGISTRY_CLIENT',
            transport: Transport.RMQ,
            options: {
              urls: [rabbitMqUrl],
              queue: 'service_registry_queue',
              queueOptions: {
                durable: false,
              },
            },
          },
        ]),
      ],
      providers: [
        {
          provide: 'SERVICE_REGISTRY_OPTIONS',
          useValue: options,
        },
        ServiceRegistryService,
      ],
      exports: [ServiceRegistryService],
    };
  }
}
