"use client";

import { twMerge } from "tailwind-merge";
import type { LocaleOption } from "@/types";
import type { TeacherData } from "@/app/[locale]/teachers/_ui/Teachers/TeachersClient";
import TeachersClient from "@/app/[locale]/teachers/_ui/Teachers/TeachersClient";

type OtherTeachersProps = {
  teachers: TeacherData[];
  locale: LocaleOption;
  headingText: string;
};

const OtherTeachers: React.FC<OtherTeachersProps> = ({
  teachers,
  locale,
  headingText,
}) => {
  if (teachers.length === 0) {
    return null;
  }

  return (
    <section
      className={twMerge(
        "relative flex flex-col items-center gap-8 py-20 overflow-hidden",
      )}
    >
      {/* Header */}
      <header className={twMerge("w-5/6 max-w-5xl text-center")}>
        {/* Title */}
        <h2>{headingText}</h2>
      </header>

      {/* Teachers */}
      <div className={twMerge("w-5/6 max-w-5xl")}>
        <TeachersClient teachers={teachers} locale={locale} />
      </div>
    </section>
  );
};

export default OtherTeachers;
