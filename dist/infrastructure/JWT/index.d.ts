import { JwtPayload } from "jsonwebtoken";
type TokenPayload = Record<string, any>;
type TokenVerifyResult = {
    payload: string | JwtPayload | null;
    expired: boolean;
};
type DesktopInfoWithExpiry = {
    [key: string]: any;
    expiryTimes: string | number;
};
type Payload = Record<string, any>;
export declare function generatePasswordTimer(payload: TokenPayload): string;
export declare function verifyTokenPasswordTimer(token: string): TokenVerifyResult;
export declare function generateToken(type: string, payload: Payload, tokenLife: string | number): string;
export declare function verifyToken(type: string, token: string): TokenVerifyResult;
export declare function signatureToken(token: string): string;
export declare function randomTokenString(): string;
export declare const generateAccessToken: (user: any) => string;
export declare const generateRefreshToken: (user: any) => string;
export declare const generateQRToken: (desktopInfo: DesktopInfoWithExpiry) => string;
declare const _default: {
    verifyToken: typeof verifyToken;
    generateToken: typeof generateToken;
    generateAccessToken: (user: any) => string;
    generateRefreshToken: (user: any) => string;
    generateQRToken: (desktopInfo: DesktopInfoWithExpiry) => string;
    randomTokenString: typeof randomTokenString;
    signatureToken: typeof signatureToken;
    generatePasswordTimer: typeof generatePasswordTimer;
    verifyTokenPasswordTimer: typeof verifyTokenPasswordTimer;
};
export default _default;
