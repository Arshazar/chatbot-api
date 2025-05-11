import { Module } from '@nestjs/common';
import { ServiceDiscoveryService } from './service-discovery.service';
import { RegistryModule } from '../registry/registry.module';

@Module({
  imports: [RegistryModule],
  providers: [ServiceDiscoveryService],
  exports: [ServiceDiscoveryService],
})
export class ServiceDiscoveryModule {}
