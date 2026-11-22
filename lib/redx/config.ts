export const REDX_CONFIG = {
  baseUrl: process.env.REDX_BASE_URL!,
  token: process.env.REDX_API_TOKEN!,
};

if (!REDX_CONFIG.baseUrl) {
  throw new Error("REDX_BASE_URL is missing");
}

if (!REDX_CONFIG.token) {
  throw new Error("REDX_API_TOKEN is missing");
}