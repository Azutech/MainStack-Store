import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name); // Using NestJS Logger

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn('No token provided');
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Validate payload structure
      if (!payload || typeof payload !== 'object' || !('id' in payload)) {
        throw new UnauthorizedException('Invalid token payload');
      }

      request['user'] = payload; // Attach payload to the request object
      return true;
    } catch (error) {
      this.logger.error('JWT verification failed', error.message);

      // Handle token expiration explicitly
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }

      throw new UnauthorizedException('Invalid token');
    }
  }
}
