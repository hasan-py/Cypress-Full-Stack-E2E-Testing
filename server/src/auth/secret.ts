import dotenv from "dotenv";
dotenv.config();
export const MONGODB_URI_LOCAL = process.env["MONGODB_URI_LOCAL"];
export const MONGODB_URI_CLOUD = process.env["MONGODB_URI_CLOUD"];
export const JWT_SECRET = process.env["JWT_SECRET"];
if (!JWT_SECRET) {
  console.log("No JWT secret string. Set JWT_SECRET environment variable.");
  process.exit(1);
}
