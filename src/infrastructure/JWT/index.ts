import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

type TokenPayload = Record<string, any>;
type TokenVerifyResult = {
  payload: string | JwtPayload | null;
  expired: boolean;
};

type UserWithExpiry = {
  [key: string]: any;
  expiry_accesstoken: string | number;
  expiry_refreshtoken: string | number;
};

type DesktopInfoWithExpiry = {
  [key: string]: any;
  expiryTimes: string | number;
};


type Payload = Record<string, any>;

export function generatePasswordTimer(payload: TokenPayload): string {
  const key = process.env.TOKEN_PASS_REFRESH_MAIL_KEY!;
  const timer = 300; // seconds = 5 minutes
  return jwt.sign({ data: payload }, key, { expiresIn: timer });
}

export function verifyTokenPasswordTimer(token: string): TokenVerifyResult {
  const key = process.env.TOKEN_PASS_REFRESH_MAIL_KEY!;
  try {
    return { payload: jwt.verify(token, key), expired: false };
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return { payload: jwt.decode(token), expired: true };
    }
    throw error;
  }
}
export function generateToken(
  type = "access",
  payload: Payload,
  tokenLife: string | number
): string {
  const key = type === "access"
    ? process.env.TOKEN_SECRET_KEY
    : process.env.REFRESH_TOKEN_SECRET_KEY;

  if (!key) {
    throw new Error("Missing JWT secret key");
  }
  const options: SignOptions = {
    expiresIn: typeof tokenLife === "string" ? parseInt(tokenLife, 10) : tokenLife
  };

  return jwt.sign({ data: payload }, key, options);
}



export function verifyToken(
  type = "access",
  token: string
): TokenVerifyResult {
  const key =
    type === "access"
      ? process.env.TOKEN_SECRET_KEY!
      : process.env.REFRESH_TOKEN_SECRET_KEY!;

  try {
    return { payload: jwt.verify(token, key), expired: false };
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return { payload: jwt.decode(token), expired: true };
    }
    throw error;
  }
}

export function signatureToken(token: string): string {
  return token.split(".")[2];
}

export function randomTokenString(): string {
  return crypto.randomBytes(40).toString("hex");
}

export const generateAccessToken = (user: any) => {
  return jwt.sign(user, process.env.TOKEN_SECRET_KEY, { expiresIn: user.expiry_accesstoken });
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: user.expiry_refreshtoken });
};



export const generateQRToken = (desktopInfo: DesktopInfoWithExpiry): string => {
  return jwt.sign(desktopInfo, process.env.TOKEN_SECRET_KEY!, {
    expiresIn: typeof desktopInfo.expiryTimes === "string"
      ? parseInt(desktopInfo.expiryTimes, 10)
      : desktopInfo.expiryTimes
  });
};

// === Export default all ===

export default {
  verifyToken,
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  generateQRToken,
  randomTokenString,
  signatureToken,
  generatePasswordTimer,
  verifyTokenPasswordTimer
};
