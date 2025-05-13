export interface ILogger {
    info(message: string): void;
    error(message: string): void;
    warn(message: string): void;
    debug(message: string): void;
}
export declare class WinstonLogger implements ILogger {
    info(message: string): void;
    error(message: string): void;
    warn(message: string): void;
    debug(message: string): void;
}
