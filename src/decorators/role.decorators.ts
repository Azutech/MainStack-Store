// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../utils/enum'

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
