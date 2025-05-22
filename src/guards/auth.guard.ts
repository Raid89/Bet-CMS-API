import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('El encabezado de autorización falta.');
    }

    const token = authHeader.includes(' ') ? authHeader.split(' ')[1] : authHeader;
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = this.jwtService.verify(token, { secret });
      request.user = decoded; // Adjuntar el usuario decodificado al objeto de solicitud
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido.');
    }
  }
}