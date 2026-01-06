import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";

/**
 * Keep-warm endpoint to prevent cold starts
 * This endpoint should be pinged periodically to keep serverless functions warm
 */
export const GET = async () => {
  // Optionally pre-warm the Payload client
  try {
    const { getCachedPayload } = await import("@/utils/payload");
    await getCachedPayload();
  } catch (error) {
    // Silently fail - this is just a warm-up call
    console.warn("Keep-warm: Failed to pre-warm Payload client", error);
  }

  return NextResponse.json({
    ok: true,
    message: "Function warmed up",
    timestamp: new Date().toISOString(),
  });
};
