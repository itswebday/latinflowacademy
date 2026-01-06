"use client";

import { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { BackgroundImage } from "@/components";
import { DEFAULT_LOCALE } from "@/constants";
import type { LocaleOption } from "@/types";

export type TeacherData = {
  id: number;
  slug: string;
  url: string;
  imageURL: string;
  imageAlt: string;
  name: string;
};

type TeachersClientProps = {
  teachers: TeacherData[];
  locale: LocaleOption;
};

const TeachersClient: React.FC<TeachersClientProps> = ({
  teachers,
  locale,
}) => {
  return (
    <div
      className={twMerge(
        "grid justify-center gap-6",
        "grid-cols-[repeat(auto-fit,var(--width-teacher))]",
        "de:gap-12",
      )}
    >
      {teachers.map((teacher) => (
        <TeacherCard key={teacher.id} teacher={teacher} locale={locale} />
      ))}
    </div>
  );
};

type TeacherCardProps = {
  teacher: TeacherData;
  locale: LocaleOption;
};

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, locale }) => {
  const [isHovered, setIsHovered] = useState(false);

  const href =
    teacher.url ||
    `${locale === DEFAULT_LOCALE ? "" : `/${locale}`}/teachers/${teacher.slug}`;

  return (
    <Link
      className={twMerge(
        "relative flex flex-col items-center gap-6",
        "w-teacher h-teacher p-8 pb-0",
        "border border-gray/30 rounded-sm",
      )}
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      {teacher.imageURL && (
        <figure className="relative w-full h-44 rounded-full border-2 border-gray/20 overflow-hidden">
          <BackgroundImage
            className={twMerge(
              "transition-transform duration-500 ease-in-out",
              isHovered && "scale-[1.15]",
            )}
            src={teacher.imageURL}
            alt={teacher.imageAlt}
          />
        </figure>
      )}

      {/* Description */}
      <div className="flex flex-col gap-2 text-center">
        {/* Name */}
        <h5 className="font-semibold">{teacher.name}</h5>
      </div>
    </Link>
  );
};

export default TeachersClient;
