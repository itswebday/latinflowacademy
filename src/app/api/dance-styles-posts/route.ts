import configPromise from "@/payload.config";
import { DEFAULT_LOCALE } from "@/constants";
import type { LocaleOption } from "@/types";
import { handleApiError } from "@/utils/server";
import { getPayload } from "payload";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = (searchParams.get("locale") ||
      DEFAULT_LOCALE) as LocaleOption;

    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
      collection: "dance-styles-posts",
      locale,
      sort: "id",
      depth: 1,
      limit: 100,
      where: {
        _status: {
          equals: "published",
        },
      },
    });

    // Transform the data to match the expected format
    const danceStyles = result.docs.map((doc) => {
      const squareImage =
        typeof doc.squareImage === "object" &&
        doc.squareImage !== null &&
        "url" in doc.squareImage
          ? doc.squareImage
          : null;

      return {
        id: doc.id,
        slug: doc.slug || null,
        url: doc.url || null,
        squareImageURL: squareImage?.url
          ? `${process.env.NEXT_PUBLIC_SERVER_URL || ""}${squareImage.url}`
          : "",
        squareImageAlt: squareImage?.alt || doc.name || "",
        name: doc.name || "",
        title: doc.title || null,
      };
    });

    return NextResponse.json({
      status: 200,
      data: danceStyles,
    });
  } catch (error) {
    return handleApiError(error);
  }
};
