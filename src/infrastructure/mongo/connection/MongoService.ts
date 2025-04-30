import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

class MongoService {
  constructor() {
    this.connect();
  }

  async connect() {
    const mongoURI =
      process.env.CLOUD_ATLAS_URL || "mongodb://localhost:27017/zalo-meta-api";
    try {
      await mongoose.connect(mongoURI, {
      });
      console.log("✅ Connected to MongoDB!");
    } catch (err) {
      console.error("MongoDB connection error:", err);
    }
  }
}
export default new MongoService();
