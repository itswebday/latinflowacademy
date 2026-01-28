"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { AnimatedWrapper } from "@/components";
import type { ReactNode } from "react";

type StoryGroup = {
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  title: ReactNode;
  text: ReactNode;
  imageUrl?: string;
  imageAlt?: string;
};

type StoryClientProps = {
  main: StoryGroup;
  a?: StoryGroup | null;
  b?: StoryGroup | null;
};

const StoryClient: React.FC<StoryClientProps> = ({ main, a, b }) => {
  const [selectedGroup, setSelectedGroup] = useState<"a" | "b" | null>(null);

  const activeGroup =
    selectedGroup === "a" ? a : selectedGroup === "b" ? b : main;

  if (!activeGroup) {
    return null;
  }

  return (
    <>
      {/* Toggle buttons */}
      {a && b && (
        <AnimatedWrapper delay={0.1} direction="up">
          <motion.div
            className="flex items-center justify-center mb-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="relative flex items-center gap-2 p-1 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <motion.button
                type="button"
                onClick={() =>
                  setSelectedGroup(selectedGroup === "a" ? null : "a")
                }
                className={twMerge(
                  "group relative px-8 py-3 font-semibold text-[16px]",
                  "rounded-xl transition-colors duration-300 ease-out",
                  "overflow-hidden",
                  selectedGroup === "a"
                    ? "text-white"
                    : "text-white/60 hover:text-white/80",
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {/* Active state background */}
                {selectedGroup === "a" && (
                  <>
                    <motion.div
                      layoutId="storyTabActive"
                      className={twMerge(
                        "absolute inset-0 rounded-xl",
                        "bg-linear-to-r from-primary to-secondary",
                        "shadow-lg shadow-primary/40",
                      )}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      aria-hidden="true"
                    />
                    <div
                      className={twMerge(
                        "absolute inset-0 rounded-xl",
                        "bg-linear-to-br from-white/10 via-transparent to-transparent",
                      )}
                      aria-hidden="true"
                    />
                  </>
                )}
                {/* Hover background for inactive */}
                {selectedGroup !== "a" && (
                  <div
                    className={twMerge(
                      "absolute inset-0 rounded-xl",
                      "bg-white/5 opacity-0 transition-opacity duration-300",
                      "group-hover:opacity-100",
                    )}
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{a.firstName || "A"}</span>
              </motion.button>
              <motion.button
                type="button"
                onClick={() =>
                  setSelectedGroup(selectedGroup === "b" ? null : "b")
                }
                className={twMerge(
                  "group relative px-8 py-3 font-semibold text-[16px]",
                  "rounded-xl transition-colors duration-300 ease-out",
                  "overflow-hidden",
                  selectedGroup === "b"
                    ? "text-white"
                    : "text-white/60 hover:text-white/80",
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {/* Active state background */}
                {selectedGroup === "b" && (
                  <>
                    <motion.div
                      layoutId="storyTabActive"
                      className={twMerge(
                        "absolute inset-0 rounded-xl",
                        "bg-linear-to-r from-primary to-secondary",
                        "shadow-lg shadow-primary/40",
                      )}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      aria-hidden="true"
                    />
                    <div
                      className={twMerge(
                        "absolute inset-0 rounded-xl",
                        "bg-linear-to-br from-white/10 via-transparent to-transparent",
                      )}
                      aria-hidden="true"
                    />
                  </>
                )}
                {/* Hover background for inactive */}
                {selectedGroup !== "b" && (
                  <div
                    className={twMerge(
                      "absolute inset-0 rounded-xl",
                      "bg-white/5 opacity-0 transition-opacity duration-300",
                      "group-hover:opacity-100",
                    )}
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{b.firstName || "B"}</span>
              </motion.button>
            </div>
          </motion.div>
        </AnimatedWrapper>
      )}

      {/* Content */}
      <AnimatedWrapper delay={0.2} direction="up">
        <div className="relative w-full min-h-[280px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selectedGroup ?? "main"}
              className={twMerge(
                "flex flex-col-reverse items-center gap-8 w-full",
                "de:flex-row de:gap-16",
              )}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {/* Content */}
              <div
                className={twMerge(
                  "flex flex-col gap-6 w-full",
                  "items-center text-center",
                  "de:w-3/4 de:items-start de:text-left",
                )}
              >
                {/* Name */}
                {(activeGroup.name ||
                  activeGroup.firstName ||
                  activeGroup.lastName) && (
                  <p className="text-[14px] font-semibold text-white/70 uppercase tracking-wide">
                    {activeGroup.name ||
                      [activeGroup.firstName, activeGroup.lastName]
                        .filter(Boolean)
                        .join(" ")}
                  </p>
                )}

                {/* Title */}
                {activeGroup.title && (
                  <h2
                    className={twMerge(
                      "text-[24px] de:text-[28px] font-bold leading-tight",
                      "bg-linear-to-r from-primary via-secondary to-primary",
                      "bg-clip-text text-transparent",
                      "bg-size-[200%_auto]",
                      "animate-[gradient_3s_ease_infinite]",
                      "drop-shadow-[0_0_20px_rgba(236,72,153,0.3)]",
                      "drop-shadow-[0_0_40px_rgba(162,54,219,0.2)]",
                    )}
                  >
                    {activeGroup.title}
                  </h2>
                )}

                {/* Text */}
                {activeGroup.text && (
                  <div className="text-[16px] text-white/90 leading-relaxed">
                    {activeGroup.text}
                  </div>
                )}
              </div>

              {/* Image */}
              {activeGroup.imageUrl && (
                <figure
                  className={twMerge(
                    "relative shrink-0 w-72 aspect-9/16 rounded-3xl overflow-hidden",
                    "transition-all duration-300 ease-out",
                    "de:w-1/3 de:pr-[20%]",
                  )}
                >
                  <Image
                    className="object-contain transition-transform duration-500 hover:scale-105"
                    style={{
                      maskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
                    }}
                    src={activeGroup.imageUrl}
                    alt={
                      activeGroup.imageAlt ||
                      activeGroup.name ||
                      [activeGroup.firstName, activeGroup.lastName]
                        .filter(Boolean)
                        .join(" ") ||
                      ""
                    }
                    fill={true}
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                </figure>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </AnimatedWrapper>
    </>
  );
};

export default StoryClient;
