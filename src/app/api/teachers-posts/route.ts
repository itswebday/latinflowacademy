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
      collection: "teachers-posts",
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
    const teachers = result.docs.map((doc) => {
      const image =
        typeof doc.image === "object" &&
        doc.image !== null &&
        "url" in doc.image
          ? doc.image
          : null;

      return {
        id: doc.id,
        slug: doc.slug || null,
        url: doc.url || null,
        imageURL: image?.url
          ? `${process.env.NEXT_PUBLIC_SERVER_URL || ""}${image.url}`
          : "",
        imageAlt: image?.alt || doc.name || "",
        name: doc.name || "",
      };
    });

    return NextResponse.json({
      status: 200,
      data: teachers,
    });
  } catch (error) {
    return handleApiError(error);
  }
};
