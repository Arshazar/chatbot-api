import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register' })
  register(@Payload() payload: any) {
    return this.authService.register(payload);
  }

  @MessagePattern({ cmd: 'login' })
  login(@Payload() payload: any) {
    return this.authService.login(payload);
  }

  @MessagePattern({ cmd: 'validate_token' })
  validateToken(@Payload() payload: { token: string }) {
    return this.authService.validateToken(payload.token);
  }

  @MessagePattern({ cmd: 'refresh_token' })
  refreshToken(@Payload() payload: { refreshToken: string }) {
    return this.authService.refreshToken(payload.refreshToken);
  }
}
