const blacklistConfig = {
    blockIPs: [
        '192.168.1.100',
        '10.0.0.50',
        '172.16.0.25'
    ],

    blockedRoutes: [
        '/admin',
        '/internal',
        '/private/*'
    ],

    isIPBlocked: function (ip) {
        return this.blockIPs.includes(ip);
    },

    isRouteBlocked: function (route) {
        return this.blockedRoutes.some(blockedRoute => {
            if (blockedRoute.endsWith('/*')) {
                const prefix = blockedRoute.slice(0, -2);
                return route.startsWith(prefix);
            }
            return route === blockedRoute;
        });
    }
};

export default blacklistConfig;