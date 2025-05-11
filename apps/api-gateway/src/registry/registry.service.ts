import { Injectable, Logger } from '@nestjs/common';
import { ServiceInfo } from 'libs/shared/src/service-registry/service-registry.service';

interface RegisteredService extends ServiceInfo {
  lastSeen: Date;
  serviceId: string;
}

@Injectable()
export class RegistryService {
  private readonly logger = new Logger(RegistryService.name);
  private readonly services = new Map<string, RegisteredService>();
  private readonly checkIntervalMs = 30000; // 30 seconds
  private interval: NodeJS.Timeout;

  constructor() {
    this.startHealthCheck();
  }

  private startHealthCheck() {
    this.interval = setInterval(() => {
      const now = new Date();
      for (const [serviceId, service] of this.services.entries()) {
        const lastSeen = service.lastSeen;
        const diffMs = now.getTime() - lastSeen.getTime();

        if (diffMs > this.checkIntervalMs * 2) {
          this.logger.warn(
            `Service ${service.name} (ID: ${serviceId}) has not sent a heartbeat in ${diffMs / 1000} seconds. Removing.`,
          );
          this.services.delete(serviceId);
        }
      }
    }, this.checkIntervalMs);
  }

  onModuleDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  registerService(serviceInfo: ServiceInfo): { serviceId: string } {
    const metadata = serviceInfo.metadata as { serviceId?: string };
    const serviceId =
      metadata?.serviceId || `${serviceInfo.name}-${Date.now()}`;

    this.services.set(serviceId, {
      ...serviceInfo,
      lastSeen: new Date(),
      serviceId,
    });

    this.logger.log(
      `Service registered: ${serviceInfo.name} (ID: ${serviceId})`,
    );
    return { serviceId };
  }

  unregisterService(serviceId: string): boolean {
    const service = this.services.get(serviceId);
    if (service) {
      this.services.delete(serviceId);
      this.logger.log(
        `Service unregistered: ${service.name} (ID: ${serviceId})`,
      );
      return true;
    }

    this.logger.warn(
      `Attempt to unregister unknown service with ID: ${serviceId}`,
    );
    return false;
  }

  updateServiceHeartbeat(serviceId: string): boolean {
    const service = this.services.get(serviceId);

    if (service) {
      service.lastSeen = new Date();
      this.logger.debug(
        `Heartbeat updated for service: ${service.name} (ID: ${serviceId})`,
      );
      return true;
    }

    this.logger.warn(
      `Heartbeat received for unknown service with ID: ${serviceId}`,
    );
    return false;
  }

  getService(serviceName: string): ServiceInfo | null {
    for (const service of this.services.values()) {
      if (service.name === serviceName) {
        return this.sanitizeService(service);
      }
    }

    this.logger.warn(`Service not found: ${serviceName}`);
    return null;
  }

  getAllServices(): ServiceInfo[] {
    return Array.from(this.services.values()).map((service) =>
      this.sanitizeService(service),
    );
  }

  private sanitizeService(service: RegisteredService): ServiceInfo {
    // Remove internal fields before returning to clients
    const { lastSeen: _lastSeen, ...sanitizedService } = service;
    return sanitizedService;
  }
}
