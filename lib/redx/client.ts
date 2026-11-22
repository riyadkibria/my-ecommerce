import { REDX_CONFIG } from "./config";

export async function redxFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const response = await fetch(
    `${REDX_CONFIG.baseUrl}${endpoint}`,
    {
      ...options,

      headers: {
        "API-ACCESS-TOKEN": `Bearer ${REDX_CONFIG.token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },

      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `RedX API Error ${response.status}: ${errorText}`
    );
  }

  return response.json();
}