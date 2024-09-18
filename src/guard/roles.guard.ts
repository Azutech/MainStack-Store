import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../utils/enum'; // Adjust import as needed

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // If no roles are specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('User role:', user.role); // Log the user role

    if (!user || !user.role) {
      throw new ForbiddenException('Access Denied: No role found');
    }

    // Check if the user has at least one of the required roles
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException('Insufficient role to access this resource');
    }

    return true;
  }
}
