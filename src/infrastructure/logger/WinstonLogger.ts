import { injectable } from 'inversify';
import { winstonInstance } from '../../config/logger';

export interface ILogger {
    info(message: string): void;
    error(message: string): void;
    warn(message: string): void;
    debug(message: string): void;
}

@injectable()
export class WinstonLogger implements ILogger {
    info(message: string): void {
        winstonInstance.info(message);
    }

    error(message: string): void {
        winstonInstance.error(message);
    }

    warn(message: string): void {
        winstonInstance.warn(message);
    }

    debug(message: string): void {
        winstonInstance.debug(message);
    }
}
