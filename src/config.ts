import dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, "../.env") });

// Interface for configuration
export interface Config {
  explorerApi: {
    url: string;
    apiKey: string;
  };
  defaults: {
    contractType: string;
  };
}

// Create and export the configuration
export const config: Config = {
  explorerApi: {
    url: process.env.EXPLORER_API_URL || "https://api.aztecscan.xyz/v1",
    apiKey: process.env.API_KEY || "temporary-api-key",
  },
  defaults: {
    contractType: process.env.DEFAULT_CONTRACT_TYPE || "Token",
  },
};
