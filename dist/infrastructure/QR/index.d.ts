declare class QRService {
    QRCode: any;
    constructor();
    generateQR(inputString: string, options?: {}): Promise<string>;
    renderQRToDOM(inputString: string, elementId: string, options?: {}): Promise<void>;
}
declare const _default: QRService;
export default _default;
