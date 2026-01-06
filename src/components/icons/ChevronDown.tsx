import { twMerge } from "tailwind-merge";

export type ChevronDownProps = {
  className?: string;
};

const ChevronDown: React.FC<ChevronDownProps> = ({ className }) => {
  return (
    <figure className={twMerge(className)}>
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 9l-7 7-7-7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
    </figure>
  );
};

export default ChevronDown;
