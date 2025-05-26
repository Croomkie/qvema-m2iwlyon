import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { Role } from '../users/enum/role';

export const RoleGuard = (roles?: Role[]): ReturnType<typeof mixin> => {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    constructor(public jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (!token) throw new UnauthorizedException();

      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        });

        if (!roles || roles.length === 0) {
          return true; // accès libre si aucun rôle spécifié
        }

        if (!roles.includes(payload.role)) {
          throw new UnauthorizedException('Accès refusé');
        }

        return true;
      } catch (error) {
        throw new UnauthorizedException('Token invalide ou expiré');
      }
    }

    extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }

  return mixin(RoleGuardMixin);
};