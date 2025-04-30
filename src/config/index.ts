import dotenv from "dotenv";
dotenv.config();

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

class ConfigureApp {
  public port: number | string;
  public clientURL: string;
  public mongo: MongoConfig;
  public cloudinary: CloudinaryConfig;
  public services: ServicesConfig;

  constructor() {
    this.port = process.env.PORT || 5000;
    this.clientURL = process.env.CLIENT_URL || "http://localhost:3000";

    const userName = process.env.CLOUD_DB_USERNAME;
    const password = process.env.CLOUD_DB_PASSWORD;

    this.mongo = {
      userName,
      password,
      url: `mongodb+srv://${userName}:${password}@cluster0.shu3wma.mongodb.net/?retryWrites=true&w=majority`,
    };

    this.cloudinary = {
      cloud_name: process.env.CLOUD_IMAGE_NAME,
      api_key: process.env.CLOUD_IMAGE_API_KEY,
      api_secret: process.env.CLOUD_IMAGE_API_SECRET,
    };

    this.services = {
      zalo: {
        version: process.env.ZALO_APP_VERSION,
        name: process.env.ZALO_APP_NAME,
      },
    };
  }
}

export default new ConfigureApp();
