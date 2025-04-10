import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

function generatePasswordTimer(payload) {
  const key = process.env.TOKEN_PASS_REFRESH_MAIL_KEY;
  const timer = 300;
  return jwt.sign({ data: payload }, key, {
    expiresIn: timer,
  });
}

function verifyTokenPasswordTimer(token) {
  const key = process.env.TOKEN_PASS_REFRESH_MAIL_KEY;
  try {
    return { payload: jwt.verify(token, key), expired: false };
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      return { payload: jwt.decode(token), expired: true };
    }
    throw error;
  }
}

function generateToken(type = "access", payload, tokenLife) {
  const key = type
    ? process.env.TOKEN_SECRET_KEY
    : process.env.REFRESH_TOKEN_SECRET_KEY;

  return jwt.sign({ data: payload }, key, {
    expiresIn: tokenLife,
  });
}

export function verifyToken(type = "access", token) {
  const key = type
    ? process.env.TOKEN_SECRET_KEY
    : process.env.REFRESH_TOKEN_SECRET_KEY;

  try {
    return { payload: jwt.verify(token, key), expired: false };
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      return { payload: jwt.decode(token), expired: true };
    }
    throw error;
  }
}

function signatureToken(token) {
  return token.split(".")[2];
}

function randomTokenString() {
  return Crypto.randomBytes(40).toString("hex");
}


export const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.TOKEN_SECRET_KEY, { expiresIn: user.expiry_accesstoken });
};

export const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: user.expiry_refreshtoken });
};


export const generateQRToken = (desktopInfo) => {
  return jwt.sign(desktopInfo, process.env.TOKEN_SECRET_KEY, { expiresIn: desktopInfo.expiryTimes });
}

export default {
  verifyToken,
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  generateQRToken,
  randomTokenString,
  signatureToken,
  generatePasswordTimer,
  verifyTokenPasswordTimer,
};
