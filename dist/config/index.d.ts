interface MongoConfig {
    userName?: string;
    password?: string;
    url: string;
}
interface CloudinaryConfig {
    cloud_name?: string;
    api_key?: string;
    api_secret?: string;
}
interface ZaloServiceConfig {
    version?: string;
    name?: string;
}
interface ServicesConfig {
    zalo: ZaloServiceConfig;
}
declare class ConfigureApp {
    port: number | string;
    clientURL: string;
    mongo: MongoConfig;
    cloudinary: CloudinaryConfig;
    services: ServicesConfig;
    constructor();
}
declare const _default: ConfigureApp;
export default _default;
