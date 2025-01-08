import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from 'express';
import { NextLoggerService } from "../modules/logger/logger.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(
        private readonly jwtService: JwtService,
        private readonly logger: NextLoggerService
    ) { }
    

    use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('El encabezado de autorización falta.');
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = this.jwtService.verify(token);
            if (decoded.role_name && decoded.role_name === 'Admin') {
                next();
            } else {
                throw new UnauthorizedException('No tienes permiso para acceder a este recurso.');
            }
        } catch (error) {
            this.logger.error('Ha ocurrido un error al verificar el token', 'AuthMiddleware', JSON.stringify(error));
            throw new UnauthorizedException('Token inválido.');
        }
    }

}