const whitelistConfig = {
    allowedIPs: [
        '192.168.1.10',
        '10.0.0.5',
        '172.16.0.2'
    ],


    allowedRoutes: [
        '/public',
        '/api/v1/*',
        '/docs'
    ],

    isIPAllowed: function (ip) {
        return this.allowedIPs.includes(ip);
    },

    isRouteAllowed: function (route) {
        return this.allowedRoutes.some(allowedRoute => {
            if (allowedRoute.endsWith('/*')) {
                const prefix = allowedRoute.slice(0, -2);
                return route.startsWith(prefix);
            }
            return route === allowedRoute;
        });
    }
};

export default whitelistConfig;