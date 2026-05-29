import React from "react";
import { twMerge } from "tailwind-merge";
import { AnimatedWrapper, Card, HeadingWithIcon } from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { TeachersBlock } from "@/payload-types";
import type { Globals, RichText } from "@/types";
import { getMediaUrlAndAlt, getPaddingClasses, processText } from "@/utils";

const Teachers: React.FC<TeachersBlock & { id?: string; globals: Globals }> = ({
  showHeading,
  heading,
  teachers,
  paddingTop,
  paddingBottom,
  hidden,
  id,
}) => {
  if (!teachers || teachers.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className={twMerge(
        "w-full overflow-hidden",
        getPaddingClasses(paddingTop, paddingBottom),
        hidden && "hidden",
      )}
    >
      {/* Container */}
      <div className="w-11/12 max-w-7xl mx-auto flex flex-col gap-10 de:gap-14">
        {/* Heading */}
        {showHeading && heading ? (
          <AnimatedWrapper delay={0} direction="up">
            <HeadingWithIcon icon={heading.icon}>
              <h2 className="font-bold">
                {typeof heading.text === "string"
                  ? processText(heading.text)
                  : heading.text}
              </h2>
            </HeadingWithIcon>
          </AnimatedWrapper>
        ) : null}

        {/* Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 de:grid-cols-3 gap-6 de:gap-10">
          {teachers.map((teacher, index) => {
            const { url: photoUrl, alt: photoAlt } = teacher.photo
              ? getMediaUrlAndAlt(teacher.photo)
              : { url: undefined, alt: undefined };

            const tags = (teacher.styles ?? [])
              .map((s) => s?.tag)
              .filter((tag): tag is string => Boolean(tag && tag.trim()));

            return (
              <AnimatedWrapper
                key={index}
                delay={index * 0.1}
                direction="up"
                className="flex flex-col shrink-0 min-h-0"
              >
                <Card
                  imageUrl={photoUrl}
                  imageAlt={photoAlt}
                  imageShape="circle"
                  title={teacher.name}
                  subtitle={teacher.role || undefined}
                  description={
                    <div className="flex flex-col gap-4">
                      {tags.length > 0 && (
                        <ul className="flex flex-wrap gap-2">
                          {tags.map((tag, i) => (
                            <li
                              key={i}
                              className={twMerge(
                                "px-3 py-1 rounded-full",
                                "bg-primary/15 border border-primary/30",
                                "text-primary text-xs font-medium",
                              )}
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                      <RichTextRenderer richText={teacher.bio as RichText} />
                    </div>
                  }
                  className="h-full min-h-0 flex-1"
                  color="primary"
                />
              </AnimatedWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Teachers;
