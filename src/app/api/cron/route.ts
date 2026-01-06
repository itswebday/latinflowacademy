import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";

export const GET = async (request: Request) => {
  // Verify the request is from Vercel Cron
  // Vercel sends the CRON_SECRET in the Authorization header
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Only check auth if CRON_SECRET is set (optional security)
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Revalidate frequently accessed pages to keep cache fresh
    const pathsToRevalidate: string[] = [];

    // Revalidate home pages for all locales
    for (const locale of LOCALES) {
      pathsToRevalidate.push(locale === DEFAULT_LOCALE ? "/" : `/${locale}`);
    }

    // Revalidate all paths
    for (const path of pathsToRevalidate) {
      revalidatePath(path);
    }

    return NextResponse.json({
      ok: true,
      revalidated: pathsToRevalidate.length,
      paths: pathsToRevalidate,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
