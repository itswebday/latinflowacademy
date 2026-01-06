import { twMerge } from "tailwind-merge";

export type EmailIconProps = {
  className?: string;
};

const EmailIcon: React.FC<EmailIconProps> = ({ className }) => {
  return (
    <figure className={twMerge(className)}>
      <svg
        className="w-full h-full"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <rect
          height="14"
          rx="2"
          strokeLinecap="round"
          strokeWidth="2"
          width="18"
          x="3"
          y="5"
        />
      </svg>
    </figure>
  );
};

export default EmailIcon;
