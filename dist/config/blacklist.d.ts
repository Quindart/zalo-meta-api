export interface IBlacklistConfig {
    blockIPs: string[];
    blockedRoutes: string[];
    isIPBlocked(ip: string): boolean;
    isRouteBlocked(route: string): boolean;
}
declare const blacklistConfig: IBlacklistConfig;
export default blacklistConfig;
