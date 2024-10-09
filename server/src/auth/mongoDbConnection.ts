import mongoose from "mongoose";
import { MONGODB_URI_CLOUD, MONGODB_URI_LOCAL } from "./secret";
mongoose.set("strictQuery", true);
export const ConnectMongoDB = () => {
  if (!MONGODB_URI_LOCAL && !MONGODB_URI_CLOUD) {
    process.exit(1);
  }
  const connection = mongoose.connection;
  connection.on("connected", () => {
    console.log("db connected");
  });
  connection.on("reconnected", () => {
    console.log("db reconnected");
  });
  connection.on("disconnected", () => {
    console.log("db disconnected");
    setTimeout(() => {
      mongoose.connect(MONGODB_URI_LOCAL || MONGODB_URI_CLOUD, {
        keepAlive: true,
        socketTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      });
    }, 3000);
  });
  connection.on("close", () => {});
  connection.on("error", (error: Error) => {
    console.log("db connection error");
  });
  const run = async () => {
    await mongoose.connect(MONGODB_URI_LOCAL || MONGODB_URI_CLOUD, {
      keepAlive: true,
    });
  };
  run().catch((error) => {});
};
