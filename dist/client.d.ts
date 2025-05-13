declare class Client {
    private client;
    private serverClient;
    private port;
    private userName;
    private localIP;
    constructor(port: number, userName: string);
    private getLocalIP;
    onInit(): void;
}
export default Client;
