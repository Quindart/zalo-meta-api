declare const whitelistConfig: {
    allowedIPs: string[];
    allowedRoutes: string[];
    isIPAllowed: (ip: any) => any;
    isRouteAllowed: (route: any) => any;
};
export default whitelistConfig;
