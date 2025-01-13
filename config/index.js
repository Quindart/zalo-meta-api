import dotenv from "dotenv";
dotenv.config();
class ConfigureApp {
  port = process.env.PORT || 5000;
  clientURL = process.env.CLIENT_URL || "http://localhost:3000";
  mongo = {
    userName: process.env.CLOUD_DB_USERNAME,
    password: process.env.CLOUD_DB_PASSWORD,
    url: `mongodb+srv://${process.env.CLOUD_DB_USERNAME}:${process.env.CLOUD_DB_PASSWORD}@cluster0.shu3wma.mongodb.net/?retryWrites=true&w=majority`,
  };
  cloudinary = {
    cloud_name: process.env.CLOUD_IMAGE_NAME,
    api_key: process.env.CLOUD_IMAGE_API_KEY,
    api_secret: process.env.CLOUD_IMAGE_API_SECRET,
  };
  services = {
    zalo: {
      version: process.env.ZALO_APP_VERSION,
      name: process.env.ZALO_APP_NAME,
    },
  };
}
export default new ConfigureApp();
