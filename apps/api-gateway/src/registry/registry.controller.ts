import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { RegistryService } from './registry.service';
import { ServiceInfo } from 'libs/shared/src/service-registry/service-registry.service';

@Controller()
export class RegistryController {
  private readonly logger = new Logger(RegistryController.name);

  constructor(private readonly registryService: RegistryService) {}

  @EventPattern('service.register')
  handleServiceRegister(data: ServiceInfo) {
    this.logger.log(`Service registration request received: ${data.name}`);
    this.registryService.registerService(data);
  }

  @EventPattern('service.unregister')
  handleServiceUnregister(data: { serviceId: string }) {
    this.logger.log(
      `Service unregistration request received: ${data.serviceId}`,
    );
    this.registryService.unregisterService(data.serviceId);
  }

  @EventPattern('service.heartbeat')
  handleServiceHeartbeat(data: { serviceId: string }) {
    this.logger.debug(`Heartbeat received from service: ${data.serviceId}`);
    this.registryService.updateServiceHeartbeat(data.serviceId);
  }

  @MessagePattern('service.get')
  getService(data: { serviceName: string }) {
    this.logger.debug(`Service request received for: ${data.serviceName}`);
    return this.registryService.getService(data.serviceName);
  }

  @MessagePattern('service.getAll')
  getAllServices() {
    this.logger.debug('All services request received');
    return this.registryService.getAllServices();
  }
}
