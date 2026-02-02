import { twMerge } from "tailwind-merge";
import { HeadingWithIcon } from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import { processText } from "@/utils";
import type { Config } from "@/payload-types";

type ScheduleProps = {
  schedule: Config["globals"]["schedule"];
};

const Schedule: React.FC<ScheduleProps> = async ({ schedule }) => {
  return (
    <section className="relative flex justify-center w-full pt-40 pb-20 bg-dark">
      {/* Container */}
      <div
        className={twMerge(
          "relative z-10 flex flex-col items-center gap-6",
          "w-11/12 mx-auto",
        )}
      >
        {/* Heading */}
        <div className="relative w-full pb-4">
          <HeadingWithIcon
            icon={schedule.heading.icon}
            className="justify-center text-center"
          >
            <h1
              className={twMerge(
                "relative font-bold text-center",
                "text-[48px] de:text-[64px]",
                "leading-tight tracking-tight",
                "bg-linear-to-r from-primary via-secondary to-primary",
                "bg-clip-text text-transparent",
                "bg-size-[200%_auto]",
                "animate-[gradient_3s_ease_infinite]",
                "drop-shadow-[0_0_30px_rgba(236,72,153,0.4)]",
                "drop-shadow-[0_0_60px_rgba(162,54,219,0.3)]",
              )}
            >
              {processText(schedule.heading.text)}
            </h1>
          </HeadingWithIcon>

          {/* Stripe below */}
          <div
            className={twMerge(
              "absolute bottom-0 left-1/2 -translate-x-1/2",
              "w-32 h-1 rounded-full",
              "bg-linear-to-r from-transparent via-primary to-transparent",
              "opacity-60",
            )}
            aria-hidden="true"
          />
        </div>

        {/* Paragraph */}
        <div
          className={twMerge(
            "max-w-3xl mx-auto text-center",
            "text-white/90",
            "leading-relaxed tracking-wide",
            "px-4 mb-12",
          )}
        >
          <RichTextRenderer richText={schedule.paragraph.text} />
        </div>

        {/* Embed Code */}
        {schedule.embedCode && (
          <div
            className="w-full h-240 rounded-xl overflow-hidden"
            dangerouslySetInnerHTML={{ __html: schedule.embedCode }}
          />
        )}
      </div>
    </section>
  );
};

export default Schedule;
