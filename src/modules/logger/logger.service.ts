import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { winstonConfig } from '../../config/winston.config';

@Injectable()
export class NextLoggerService {

    private readonly logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger(winstonConfig);
    }

    log(message: string, functionName?: string, data?: any) {
        this.logger.info(`${message} -> ${functionName} -> ${data || 'No Data'}`);
    }

    error(message: string, functionName?: string, data?: string) {
        this.logger.error(`${message} -> ${functionName} -> ${data || 'No Data'}`);
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    debug(message: string) {
        this.logger.debug(message);
    }

    verbose(message: string) {
        this.logger.verbose(message);
    }
    
}