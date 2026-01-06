"use server";

import { ButtonLink } from "@/components";
import { getTranslations } from "next-intl/server";

const PageNotFoundPage = async () => {
  const pageNotFoundT = await getTranslations("pageNotFound");
  const homeT = await getTranslations("home");

  return (
    <main className="flex justify-center items-center min-h-screen bg-white">
      {/* Container */}
      <div
        className={`
          flex flex-col items-center text-center gap-8
          w-11/12 max-w-4xl
        `}
      >
        {/* 404 */}
        <h1 className="text-8xl md:text-9xl font-black text-primary leading-none">
          404
        </h1>

        {/* Message */}
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {pageNotFoundT("title")}
          </h2>
          <p className="text-[16px] leading-relaxed text-gray-700">
            {pageNotFoundT("paragraph")}
          </p>
        </div>

        {/* Button */}
        <ButtonLink href={homeT("url")} variant="primaryButton">
          {homeT("title")}
        </ButtonLink>
      </div>
    </main>
  );
};

export default PageNotFoundPage;
