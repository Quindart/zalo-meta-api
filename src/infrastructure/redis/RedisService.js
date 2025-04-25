// import Redis from "ioredis";

// class RedisService {
//   constructor() {
//     this.redis = new Redis({
//       host: process.env.REDIS_HOST || "127.0.0.1",
//       port: process.env.REDIS_PORT || 6379,
//       password: process.env.REDIS_PASSWORD || null,
//     });
//   }
//   async connect() {
//     this.redis.on("connect", () => {
//       // return console.log("✅> Connected to Redis!");
//     });
//     // console.log("✅> Connected to Redis!");

//     this.redis.on("error", (err) => {
//       console.error("Redis connection error:", err);
//     });
//   }
//   async set(key, value, expiry = 3600) {
//     try {
//       await this.redis.set(key, value, "EX", expiry);
//       console.log(` Key set: ${key}`);
//     } catch (err) {
//       console.error(" Error setting key:", err);
//     }
//   }
//   async get(key) {
//     try {
//       const value = await this.redis.get(key);
//       return value;
//     } catch (err) {
//       console.error(" Error getting key:", err);
//     }
//   }
//   async del(key) {
//     try {
//       await this.redis.del(key);
//       console.log(` Key deleted: ${key}`);
//     } catch (err) {
//       console.error(" Error deleting key:", err);
//     }
//   }
// }

// export default new RedisService();
