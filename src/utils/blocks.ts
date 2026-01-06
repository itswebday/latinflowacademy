export const getBackgroundClasses = (
  background: "transparent" | "white" | "light",
): string => {
  if (background === "white") {
    return "bg-white";
  }

  if (background === "light") {
    return "bg-light";
  }

  return "";
};

export const getPaddingClasses = (
  paddingTop?: "none" | "small" | "medium" | "large" | null,
  paddingBottom?: "none" | "small" | "medium" | "large" | null,
): string => {
  const topClass =
    paddingTop === "none"
      ? "pt-0"
      : paddingTop === "small"
        ? "pt-6"
        : paddingTop === "medium"
          ? "pt-12"
          : paddingTop === "large"
            ? "pt-20"
            : "pt-12";
  const bottomClass =
    paddingBottom === "none"
      ? "pb-0"
      : paddingBottom === "small"
        ? "pb-6"
        : paddingBottom === "medium"
          ? "pb-12"
          : paddingBottom === "large"
            ? "pb-20"
            : "pb-12";

  return `${topClass} ${bottomClass}`;
};
