import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class IsMigrationMiddleware implements NestMiddleware {

    private isMigration = this.configService.get('IS_MIGRATION');

    constructor(private readonly configService: ConfigService){}

    use(req: Request, res: Response, next: NextFunction) {
        if (this.isMigration) {
            next();
        } else {
            res.status(401).json({message: 'Servicio no disponible por mantenimiento'});
        }
    }
}