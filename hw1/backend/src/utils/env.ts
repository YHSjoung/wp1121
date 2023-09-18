import dotenv from "dotenv";

dotenv.config();

// Make sure every environment variable is `string`.
export const env = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "",
};
