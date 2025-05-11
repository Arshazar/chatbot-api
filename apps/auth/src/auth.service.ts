import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async register(payload: any) {
    // Implementation will be added later
    return { message: 'User registration will be implemented' };
  }

  async login(payload: any) {
    // Implementation will be added later
    return { message: 'User login will be implemented' };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return { isValid: true, userId: payload.sub };
    } catch (error) {
      return { isValid: false };
    }
  }

  async refreshToken(refreshToken: string) {
    // Implementation will be added later
    return { message: 'Token refresh will be implemented' };
  }
}
