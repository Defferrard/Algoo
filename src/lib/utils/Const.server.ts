import * as dotenv from "dotenv";

dotenv.config();

export const BASE_REGISTRY = process.env.BASE_REGISTRY || "registry.defferrard.dev";
export const REGISTRY_URL_API = process.env.REGISTRY_URL_API || "https://registry.defferrard.dev/v2"
export const DEPLOYER_URL_API = process.env.DEPLOYER_URL_API || "http://localhost:8080"