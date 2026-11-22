"use server";

import { redxFetch } from "@/lib/redx/client";
import type { RedxArea } from "@/lib/redx/types";

export async function getRedxAreas(): Promise<RedxArea[]> {
  try {
    const data = await redxFetch("/areas");

    return data;
  } catch (error) {
    console.error("Failed to fetch RedX Areas:", error);

    throw error;
  }
}