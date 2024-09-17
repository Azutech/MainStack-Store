// roles.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { Role } from '../utils/enum';
  import { JwtAuthGuard } from './jwt.guard'; // Assuming the JwtAuthGuard is already implemented
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]);
  
      // If no roles are specified, allow the request (no role restrictions)
      if (!requiredRoles) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      if (!user || !user.roles) {
        throw new ForbiddenException('Access Denied');
      }
  
      // Check if the user's roles include any of the required roles
      const hasRole = requiredRoles.some((role) => user.roles.includes(role));
  
      if (!hasRole) {
        throw new ForbiddenException('Insufficient role to access this resource');
      }
  
      return hasRole;
    }
  }
  